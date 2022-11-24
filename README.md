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
