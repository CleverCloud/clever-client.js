import { InitStripeCommand } from '../../../../../src/clients/api/commands/stripe/init-stripe-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

// Cannot be automatised. Even like that tests are failing because... I don't know
describe('stripe commands', function () {
  this.timeout(10000);

  const support = e2eSupport({ auth: 'DEV' });

  const orga = 'orga_540caeb6-521c-4a19-a955-efe6da35d142';
  const invoice = 'FA20250108-000019';

  it('should initialize stripe payement', async () => {
    const response = await support.client.send(new InitStripeCommand({ ownerId: orga, invoiceNumber: invoice }));

    console.log(response);
  });
});
