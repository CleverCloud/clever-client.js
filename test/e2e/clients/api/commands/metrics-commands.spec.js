import { GetMetricsCommand } from '../../../../../src/clients/api/commands/metrics/get-metrics-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('metrics-commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteAddons();
  });

  it('should work', async () => {
    // const addon = await support.createTestAddon();

    console.log(
      await support.client.send(
        new GetMetricsCommand({
          // need dev account to access this resource
          addonId: 'mysql_a796df95-17fc-4403-b333-7de9558ef488',
          metrics: ['mem'],
        }),
      ),
    );
  });
});
