import { expect } from 'chai';
import { GetCreditsSummaryCommand } from '../../../../../src/clients/cc-api/commands/credits/get-credits-summary-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('credits commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should get credits', async () => {
    const response = await support.client.send(new GetCreditsSummaryCommand({ ownerId: support.organisationId }));

    expect(response).to.deep.equal({ prepaidCredit: 0, freeCredit: 20, currency: 'EUR' });
  });
});
