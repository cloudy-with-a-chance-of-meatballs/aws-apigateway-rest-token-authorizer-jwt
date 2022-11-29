const { typescript, javascript } = require('projen');
const project = new typescript.TypeScriptProject({
  author: 'cfuerst',
  authorAddress: 'c.fuerst@gmail.com',
  defaultReleaseBranch: 'main',
  name: '@cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt',
  repositoryUrl: 'https://github.com/cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt.git',
  description: 'Use as jwt authorizer for api gateways on aws',
  stability: 'experimental',
  license: 'MIT',
  copyrightOwner: '@cloudy-with-a-chance-of-meatballs',
  keywords: ['aws', 'cdk', 'lambda', 'apigateway', 'rest', 'api', 'jwt', 'tokenauthorizer', 'jwks', 'authorizer', 'token'],
  deps: [
    '@types/aws-lambda',
    'jsonwebtoken',
    '@types/jsonwebtoken',
    'jwks-rsa',
    'ajv',
  ],
  npmAccess: javascript.NpmAccess.PUBLIC,
  autoMerge: true,
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['dependabot[bot]'],
  },
  dependabot: true,
  dependabotOptions: {
    labels: ['auto-approve'],
  },
  codeCov: true,
  minNodeVersion: '16.18.1',
  releaseToNpm: true,
});
project.synth();
