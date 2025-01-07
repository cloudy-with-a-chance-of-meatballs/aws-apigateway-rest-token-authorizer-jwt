import { typescript } from 'projen';
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'aws-apigateway-rest-token-authorizer-jwt',
  projenrcTs: true,
  deps: [
    '@types/aws-lambda',
    'jsonwebtoken',
    '@types/jsonwebtoken',
    'jwks-rsa',
    'ajv',
  ],
});
project.synth();
