import Ajv, { JTDDataType } from 'ajv/dist/jtd';
import { AuthResponse, APIGatewayTokenAuthorizerEvent, PolicyDocument } from 'aws-lambda';
import jwt, { Secret } from 'jsonwebtoken';
import jwks from 'jwks-rsa';

const AJV_VALIDATOR_DEFAULT_OPTIONS = {
  strictTypes: true,
  strictTuples: true,
  strictRequired: true,
};
const JWKS_CLIENT_DEFAULT_OPTIONS = {
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000,
};

const POLICY_VERSION = '2012-10-17';
const POLICY_ACTION = 'execute-api:Invoke';
const POLICY_RESOURCE = '*';

enum PolicyStatementEffect {
  DENY = 'Deny',
  ALLOW = 'Allow'
}

type AuthorizerPolicyDocument = {
  Version: string;
  Statement: [{
    Action: string;
    Effect: PolicyStatementEffect;
    Resource: string;
  }];
};

const policyDefaults: AuthorizerPolicyDocument = {
  Version: POLICY_VERSION,
  Statement: [{
    Action: POLICY_ACTION,
    Effect: PolicyStatementEffect.DENY,
    Resource: POLICY_RESOURCE,
  }],
};

export interface ITokenValidationStrategyAjvJsonSchemaValidator {
  readonly strategyName: 'schema';
  readonly schema: string;
}

export interface ITokenVerificationStrategyArgument {
  readonly strategyName: 'argument';
  readonly secret: string;
}

export interface ITokenVerificationStrategyJwksFromUriByKid {
  readonly strategyName: 'jwksFromUriByKid';
  readonly uri: string;
  readonly kid: string;
}

export interface ITokenAuthorizerOptions {
  readonly verificationStrategy: ITokenVerificationStrategyArgument | ITokenVerificationStrategyJwksFromUriByKid;
  readonly payloadValidationStrategy?: ITokenValidationStrategyAjvJsonSchemaValidator;
}

enum AuthorizerErrorConstants {
  Validation = 'JWT_PAYLOAD_VALIDATION_ERROR',
  JwksPrefix = 'JWKS_',
  EventToken = 'MISSING_AUTHORIZATION_TOKEN',
}

const ajv = new Ajv({ ...AJV_VALIDATOR_DEFAULT_OPTIONS });

export class AwsApigatewayRestTokenAuthorizerJwt {

  public async getAuthResponse(event: APIGatewayTokenAuthorizerEvent, o: ITokenAuthorizerOptions): Promise<AuthResponse> {

    if (!event.authorizationToken) throw new Error(AuthorizerErrorConstants.EventToken);

    let secret;
    switch (o.verificationStrategy.strategyName) {
      case 'argument':
        secret = (o.verificationStrategy.secret as Secret);
    }
    switch (o.verificationStrategy.strategyName) {
      case 'jwksFromUriByKid':
        secret = (await this.getPublicKeyFromJwksUri(o.verificationStrategy.uri, o.verificationStrategy.kid) as Secret);
    }
    try {
      let decodedJwt: any = (jwt.verify(event.authorizationToken, (secret as Secret)) as any);
      switch (o.payloadValidationStrategy?.strategyName || '') {
        case 'schema':
          decodedJwt = this.validateJwtPayloadAgainstJsonSchema(decodedJwt, o.payloadValidationStrategy!.schema);
      }
      return this.authResponseAllow(decodedJwt);
    } catch (e) {
      return this.authResponseError((e as Error).name.toUpperCase(), (e as Error).message);
    }
  };

  private authResponse(policyDocument: PolicyDocument, context: any): AuthResponse {
    return {
      principalId: 'user',
      context: context,
      policyDocument: policyDocument,
    } as AuthResponse;
  };

  private authResponseError(type: string, message: string): AuthResponse {
    const policy = this.authorizerPolicyDocument(PolicyStatementEffect.DENY) as PolicyDocument;
    return this.authResponse(policy, {
      error: true,
      errorType: type,
      errorMessage: message,
    });
  };

  private authResponseAllow(context: any): AuthResponse {
    const policy = this.authorizerPolicyDocument(PolicyStatementEffect.ALLOW) as PolicyDocument;
    return this.authResponse(policy, { error: false, ...context });
  };

  private async getPublicKeyFromJwksUri(jwksUri: string, jwksKid: string): Promise<Secret> {
    try {
      // try to fetch the jwks.json
      const jwksClient = jwks({ jwksUri: jwksUri, ...JWKS_CLIENT_DEFAULT_OPTIONS });
      const jwksKey = await jwksClient.getSigningKey(jwksKid);
      return jwksKey.getPublicKey();
    } catch (e) {
      throw new Error(AuthorizerErrorConstants.JwksPrefix + (e as Error).name.toUpperCase());
    }
  };

  private validateJwtPayloadAgainstJsonSchema(payload: any, schemaAsJson: string): any {
    const schema = JSON.parse(schemaAsJson);
    type schemaType = JTDDataType<typeof schema>;
    const validate = ajv.compile<schemaType>(schema);
    if (validate(payload)) return payload;
    throw new JwtPayloadValidationError(JSON.stringify(validate.errors));
  };

  private authorizerPolicyDocument(effect: PolicyStatementEffect): AuthorizerPolicyDocument {
    const authPolicy = Object.assign({}, policyDefaults);
    authPolicy.Statement[0].Effect = effect;
    return authPolicy as AuthorizerPolicyDocument;
  };
}

export class JwtPayloadValidationError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = AuthorizerErrorConstants.Validation;
    Object.setPrototypeOf(this, JwtPayloadValidationError.prototype);
  }
}
