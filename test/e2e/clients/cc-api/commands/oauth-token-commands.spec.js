import { ListOauthTokenCommand } from '../../../../../src/clients/cc-api/commands/oauth-token/list-oauth-token-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

// todo: we need to figure out to create oauth token
describe.skip('oauth token commands', function () {
  this.timeout(10000);

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
