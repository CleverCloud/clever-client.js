import { ListOauthTokenCommand } from '../../../../../src/clients/cc-api/commands/oauth-token/list-oauth-token-command.js';
import { e2eSupport } from '../e2e-support.js';

// creating oauth token is not easy (we could reuse the OAuthDance class in cc-api-bridge code).
// for now, we skip this test suite
describe.skip('oauth token commands', function () {
  const support = e2eSupport({ auth: 'oauth-v1' });

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should list oauth tokens', async () => {
    const response = await support.client.send(new ListOauthTokenCommand());

    console.log(response);
  });

  it('should delete oauth token', async () => {
    const response = await support.client.send(new ListOauthTokenCommand());

    console.log(response);
  });
});
