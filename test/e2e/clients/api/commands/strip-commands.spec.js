import { InitStripeCommand } from '../../../../../src/clients/api/commands/stripe/init-stripe-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('stripe commands', function () {
  this.timeout(10000);

  const support = e2eSupport(false);

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {});

  const orga = 'orga_540caeb6-521c-4a19-a955-efe6da35d142';
  const invoice = 'FA20250108-000019';

  it('should initialize stripe payement', async () => {
    const response = await support
      .getClient('DEV')
      .send(new InitStripeCommand({ ownerId: orga, invoiceNumber: invoice }));

    console.log(response);
  });
});
