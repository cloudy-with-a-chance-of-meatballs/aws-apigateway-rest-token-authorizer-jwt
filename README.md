# aws-apigateway-rest-token-authorizer-jwt

A typescript class strongly coupled to aws apigateway and lambda


## Usage

```shell
npm install @cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt
```

### Typescript
```typescript
// package.json
// {
//   "main": "index.js",
//   "type": "module",
//   "dependencies": {
//     "@cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt": "^0.0.0"
//   }
// }


import { AwsApigatewayRestTokenAuthorizerJwt } from '@cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt';

const authorizer = new AwsApigatewayRestTokenAuthorizerJwt();
```

### Recommended Typescript usage inside a Lambda function added to a RestAPI as token authorizer

```typescript
// package.json
// {
//   "main": "index.js",
//   "type": "module",
//   "dependencies": {
//     "@cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt": "^0.0.0",
//     "@types/aws-lambda": "^8.10.109"
//   }
// }

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

### Javascript
```javascript
// package.json
// {
//   "main": "index.js",
//   "dependencies": {
//     "@cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt": "^0.0.0"
//   }
// }


const { AwsApigatewayRestTokenAuthorizerJwt } = require('@cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt');

const authorizer = new AwsApigatewayRestTokenAuthorizerJwt();
```

### Token verification

```javascript
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

```javascript
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
