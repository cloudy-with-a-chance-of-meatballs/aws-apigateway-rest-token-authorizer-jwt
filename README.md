# aws-apigateway-rest-token-authorizer-jwt

A typescript class strongly coupled to aws apigateway and lambda


## Usage

```shell
npm install @cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt
```

### Basic
```typescript
import { AwsApigatewayRestTokenAuthorizerJwt } from '@cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt';

const authorizer = new AwsApigatewayRestTokenAuthorizerJwt();
```

### Recommended usage inside a Lambda function added to a RestAPI as token authorizer

```typescript
import { AwsApigatewayRestTokenAuthorizerJwt }          from '@cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt';
import { AuthResponse, APIGatewayTokenAuthorizerEvent } from "aws-lambda";

const authorizer = new AwsApigatewayRestTokenAuthorizerJwt();

// handle event
export const authHandler = async (event: APIGatewayTokenAuthorizerEvent): Promise<AuthResponse> => {
  const options: ITokenAuthorizerOptions = {
    verificationStrategy: {
      strategyName: "argument", // or jwksFromUriByKid and provide uri and kid
      secret: "foobar",
    },
    payloadValidationStrategy: {
      strategyName: "schema",
      schema: JSON.stringify({
          properties:{ iss: { enum: ['my_trusted_iss'] } } //...
      })
    }
  };
  return authorizer.getAuthResponse(event, options);
};
```

### Token verification

```typescript
// against asymmetric or symmetric "secret"

authorizer.getAuthResponse(
  { type: 'TOKEN', methodArn: 'methodArn', authorizationToken: 'JWTTOKENSTR' },
  {
    verificationStrategy: {
      strategyName: 'argument',
      secret: 'YOUR-SECRET-OR-PUB-KEY-ONELINER'
    }
  }
);

// against pub key from jwks

authorizer.getAuthResponse(
  { type: 'TOKEN', methodArn: 'methodArn', authorizationToken: 'JWTTOKENSTR' },
  {
    verificationStrategy: {
      strategyName: 'jwksFromUriByKid',
      uri: 'https://example.auth0.com/.well-known/jwks.json',
      kid: 'MN9dzu6gnI4ZZ-tjylYNW'
    }
  }
);
```

### Token validation

```typescript
// JSONSTR = https://ajv.js.org/json-schema.html

authorizer.getAuthResponse(
  { type: 'TOKEN', methodArn: 'methodArn', authorizationToken: 'JWTTOKENSTR' },
  {
    payloadValidationStrategy: {
      strategyName: 'schema',
      schema: 'JSONSTR',
    }
  }
);

```
