import { ListLogCommand } from '../../../../../src/clients/api/commands/log/list-log-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

let currentAddonId = 'addon_5b4a7c43-4b84-45e6-837c-153308182bf1';

describe('log-command', function () {
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

  it('should log with default', async () => {
    const addon = await support.createTestAddon();

    console.log(await support.client.send(new ListLogCommand({ addonId: addon.id })));
  });

  it('should log by deployment id', async () => {
    const addon = await support.createTestAddon();

    console.log(
      await support.client.send(
        new ListLogCommand({
          addonId: currentAddonId,
          deploymentId: 'deployment_21a2898d-2884-4eca-9dbb-99714b91d188',
          limit: 10,
          order: 'DESC',
          until: '2025-05-19T03:24:31.000Z',
          filter: 'clever_backup',
        }),
      ),
    );
  });
});
