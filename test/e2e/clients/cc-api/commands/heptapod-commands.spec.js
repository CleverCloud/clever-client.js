import { expect } from 'chai';
import { GetHeptapodPriceEstimationCommand } from '../../../../../src/clients/cc-api/commands/heptapod/get-heptapod-price-estimation-command.js';
import { e2eSupport, STATIC_ORGANISATION_ID } from '../e2e-support.js';

describe('heptapod commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should get null heptapod price estimation on user organisation', async () => {
    const response = await support.client.send(new GetHeptapodPriceEstimationCommand({ ownerId: support.userId }));

    expect(response).to.be.null;
  });

  it('should get heptapod price estimation on organisation', async () => {
    const response = await support.client.send(
      new GetHeptapodPriceEstimationCommand({ ownerId: STATIC_ORGANISATION_ID }),
    );

    expect(response.publicActiveUsers).to.be.a('number');
    expect(response.privateActiveUsers).to.be.a('number');
    expect(response.storage).to.be.a('number');
    expect(response.price).to.be.a('number');
  });
});
