import { GetMatomoInfoCommand } from '../../../../../src/clients/api/commands/matomo/get-matomo-info-command.js';
import { getCcApiClient } from '../../../../lib/cc-api-client.js';

let currentAddonId = 'addon_bca9234a-7515-4b17-8055-820c6cd8bf86';

describe('matomo-command', function () {
  this.timeout(10000);

  it('should work', async () => {
    console.log(await getCcApiClient().send(new GetMatomoInfoCommand({ addonId: currentAddonId })));
  });
});
