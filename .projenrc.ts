import { typescript, javascript } from 'projen';
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'aws-apigateway-rest-token-authorizer-jwt',
  description: 'Use as jwt authorizer for api gateways on aws',
  stability: 'experimental',
  license: 'MIT',
  copyrightOwner: '@cloudy-with-a-chance-of-meatballs',
  packageName:
    '@cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt',
  projenrcTs: true,
  deps: [
    '@types/aws-lambda',
    'jsonwebtoken',
    '@types/jsonwebtoken',
    'jwks-rsa',
    'ajv',
  ],
  npmAccess: javascript.NpmAccess.PUBLIC,
  dependabot: true,
  codeCov: true,
});
project.synth();
