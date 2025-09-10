import { InitStripeCommand } from '../../../../../src/clients/cc-api/commands/payment/init-stripe-command.js';
import { e2eSupport, STATIC_INVOICE_ID } from '../e2e-support.js';

// Cannot be automatised. Even like that tests are failing because... I don't know
// todo: find a way to add a payement method
describe.skip('payment commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  it('should initialize stripe payement', async () => {
    const response = await support.client.send(
      new InitStripeCommand({ ownerId: support.userId, invoiceNumber: STATIC_INVOICE_ID }),
    );

    console.log(response);
  });
});
