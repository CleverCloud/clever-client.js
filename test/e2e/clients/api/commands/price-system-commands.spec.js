import { GetPriceSystemCommand } from '../../../../../src/clients/api/commands/price-system/get-price-system-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('price system commands', function () {
  this.timeout(10000);

  const support = e2eSupport(false);

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {});

  it('should get price system', async () => {
    const response = await support.client.send(
      new GetPriceSystemCommand({
        ownerId: support.organisationId,
        zone: 'par',
      }),
    );
    console.log(JSON.stringify(response, null, 2));
  });
});
