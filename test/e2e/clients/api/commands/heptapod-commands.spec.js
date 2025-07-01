import { expect } from 'chai';
import { GetHeptapodPriceEstimationCommand } from '../../../../../src/clients/api/commands/heptapod/get-heptapod-price-estimation-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('heptapod commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteOrganisations();
  });

  it('should get null heptapod price estimation on user organisation', async () => {
    const response = await support.client.send(new GetHeptapodPriceEstimationCommand({ ownerId: support.userId }));

    expect(response).to.be.null;
  });

  it('should get heptapod price estimation on organisation', async () => {
    const organisation = await support.createTestOrganisation();

    const response = await support.client.send(new GetHeptapodPriceEstimationCommand({ ownerId: organisation.id }));

    console.log(response);

    expect(response.publicActiveUsers).to.be.a('number');
    expect(response.privateActiveUsers).to.be.a('number');
    expect(response.storage).to.be.a('number');
    expect(response.price).to.be.a('number');
  });
});
