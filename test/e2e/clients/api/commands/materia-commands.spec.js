import { GetMateriaInfoCommand } from '../../../../../src/clients/api/commands/materia/get-materia-info-command.js';
import { getCcApiClient } from '../../../../lib/e2e-support.js';

let currentAddonId = 'addon_39eaf2e0-8784-49a9-bf6a-e1e7ee111573';

describe('materia-command', function () {
  this.timeout(10000);

  it('should work', async () => {
    console.log(await getCcApiClient().send(new GetMateriaInfoCommand({ addonId: currentAddonId })));
  });
});
