import { ListLogCommand } from '../../../../../src/clients/api/commands/log/list-log-command.js';
import { getCcApiClient } from '../../../../lib/cc-api-client.js';

let currentApplicationId = 'app_b75977aa-563f-40fd-a592-224a5f6afbd6';
let currentAddonId = 'addon_5b4a7c43-4b84-45e6-837c-153308182bf1';

describe('link-command', function () {
  this.timeout(10000);

  it('should log with default', async () => {
    console.log(await getCcApiClient().send(new ListLogCommand({ addonId: currentAddonId })));
  });

  it('should log by deployment id', async () => {
    console.log(
      await getCcApiClient().send(
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
