import { expect } from 'chai';
import { GetWarpTokenCommand } from '../../../../../src/clients/cc-api/commands/warp-token/get-warp-token-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('warp token commands', function () {
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
        applications: ['metrics'],
        ttl: 'P5D',
      }),
    );

    expect(response.token).to.be.a('string');
    checkDateFormat(response.expiresAt);
    checkDateFormat(response.createdAt);
    expect(response.scope).to.be.equal('READ');
    expect(response.applications).to.deep.equalInAnyOrder(['metrics']);
  });

  it('should get access logs token', async () => {
    const response = await support.client.send(
      new GetWarpTokenCommand({
        ownerId: support.organisationId,
        applications: ['metrics.accesslogs'],
        ttl: 'P5D',
      }),
    );

    expect(response.token).to.be.a('string');
    checkDateFormat(response.expiresAt);
    checkDateFormat(response.createdAt);
    expect(response.scope).to.be.equal('READ');
    expect(response.applications).to.deep.equalInAnyOrder(['metrics.accesslogs']);
  });

  it('should get metrics token for application', async () => {
    const application = await support.createTestApplication();
    const response = await support.client.send(
      new GetWarpTokenCommand({
        applicationId: application.id,
        applications: ['metrics'],
        ttl: 'P5D',
      }),
    );

    expect(response.token).to.be.a('string');
    checkDateFormat(response.expiresAt);
    checkDateFormat(response.createdAt);
    expect(response.scope).to.be.equal('READ');
    expect(response.applications).to.deep.equalInAnyOrder(['metrics']);
  });

  it('should get access logs token for application', async () => {
    const application = await support.createTestApplication();
    const response = await support.client.send(
      new GetWarpTokenCommand({
        applicationId: application.id,
        applications: ['metrics.accesslogs'],
        ttl: 'P5D',
      }),
    );

    expect(response.token).to.be.a('string');
    checkDateFormat(response.expiresAt);
    checkDateFormat(response.createdAt);
    expect(response.scope).to.be.equal('READ');
    expect(response.applications).to.deep.equalInAnyOrder(['metrics.accesslogs']);
  });
});
