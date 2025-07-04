import { expect } from 'chai';
import { GetWarpTokenCommand } from '../../../../../src/clients/api/commands/warp-token/get-warp-token-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('warp token commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should get metrics token', async () => {
    const response = await support.client.send(
      new GetWarpTokenCommand({
        ownerId: support.organisationId,
        tokenKind: 'METRICS',
      }),
    );

    expect(response).to.be.a('string');
  });

  it('should get access logs token', async () => {
    const response = await support.client.send(
      new GetWarpTokenCommand({
        ownerId: support.organisationId,
        tokenKind: 'ACCESS_LOGS',
      }),
    );

    expect(response).to.be.a('string');
  });
});
