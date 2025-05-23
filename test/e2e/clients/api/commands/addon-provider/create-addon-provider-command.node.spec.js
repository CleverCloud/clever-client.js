import { expect } from 'chai';
import { CcApiClientToken } from '../../../../../../src/clients/api/cc-api-client-token.js';
import { CreateAddonProviderCommand } from '../../../../../../src/clients/api/commands/addon-provider/create-addon-provider-command.js';
import { DeleteAddonProviderCommand } from '../../../../../../src/clients/api/commands/addon-provider/delete-addon-provider-command.js';

describe('create-addon-provider-command', () => {
  /** @type {CcApiClientToken} */
  let client;
  before(() => {
    client = client = new CcApiClientToken({
      apiToken: process.env.CC_TEST_API_TOKEN,
      defaultRequestConfig: {
        debug: true,
      },
    });
  });

  afterEach(async () => {
    const result = await client.send(new DeleteAddonProviderCommand({ addonProviderId: 'test-addon-provider' }));
    console.log(result);
  });

  it('should create addon provider', async () => {
    const client = new CcApiClientToken({
      apiToken: process.env.CC_TEST_API_TOKEN,
    });

    const result = await client.send(
      new CreateAddonProviderCommand({
        ownerId: process.env.CC_TEST_OWNER_ID,
        id: 'test-addon-provider',
        name: 'Test Addon Provider',
        api: {
          configVars: [],
          regions: ['par'],
          password: '354635365qd1rg35q4dfg365qd4fg365qds4g3q65sdg436q5dresg4q365dsg4q365sdg4qs3d56g',
          ssoSalt: 'ze87tgsdv654hj749yu8ks65dc4sqd68gh7retyjn65fdv4sd9fr8juio3l5k213u2j,k4e98dr7gr5',
          production: {
            baseUrl: 'https://example.com/prod/base',
            ssoUrl: 'https://example.com/prod/sso',
          },
          test: {
            baseUrl: 'https://example.com/test/base',
            ssoUrl: 'https://example.com/test/sso',
          },
        },
      }),
    );

    expect(result.id).to.deep.equal('test-addon-provider');
    expect(result.name).to.deep.equal('Test Addon Provider');
    expect(result.status).to.deep.equal('ALPHA');
  });
});
