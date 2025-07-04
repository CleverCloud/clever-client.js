import { ListOauthTokenCommand } from '../../../../../src/clients/api/commands/oauth-token/list-oauth-token-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('oauth token commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

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
