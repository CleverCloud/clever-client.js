import { afterAll, beforeAll, describe, it } from 'vitest';
import { DeleteOauthTokenCommand } from '../../../../../src/clients/cc-api/commands/oauth-token/delete-oauth-token-command.js';
import { GetCurrentOauthTokenInfoCommand } from '../../../../../src/clients/cc-api/commands/oauth-token/get-current-oauth-token-info-command.js';
import { ListOauthTokenCommand } from '../../../../../src/clients/cc-api/commands/oauth-token/list-oauth-token-command.js';
import { e2eSupport } from '../e2e-support.js';

// creating oauth token is not easy (we could reuse the OAuthDance class in cc-api-bridge code).
// for now, we skip this test suite
describe('oauth token commands', function () {
  const support = e2eSupport({ auth: 'oauth-v1' });

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should list oauth tokens', async () => {
    const response = await support.client.send(new ListOauthTokenCommand());

    console.log(response);
  });

  it('should get current token info', async () => {
    const response = await support.client.send(new GetCurrentOauthTokenInfoCommand());

    console.log(response);
  });

  it('should delete oauth token', async () => {
    const token = await support.client.send(new GetCurrentOauthTokenInfoCommand());
    const response = await support.client.send(new DeleteOauthTokenCommand(token));

    console.log(response);
  });
});
