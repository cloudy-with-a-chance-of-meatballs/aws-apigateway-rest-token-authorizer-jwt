import { typescript, javascript, github } from 'projen';
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
  releaseToNpm: true,
  repository: 'https://github.com/cloudy-with-a-chance-of-meatballs/aws-apigateway-rest-token-authorizer-jwt',
  githubOptions: {
    projenCredentials: github.GithubCredentials.fromApp({
      permissions: {
        pullRequests: github.workflows.AppPermission.WRITE,
        contents: github.workflows.AppPermission.WRITE,
      },
    }),
  },
});
project.synth();
