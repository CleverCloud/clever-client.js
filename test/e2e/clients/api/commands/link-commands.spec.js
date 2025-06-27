import { AddLinkCommand } from '../../../../../src/clients/api/commands/link/add-link-command.js';
import { ListLinkCommand } from '../../../../../src/clients/api/commands/link/list-link-command.js';
import { RemoveLinkCommand } from '../../../../../src/clients/api/commands/link/remove-link-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

let currentApplicationId = 'app_b75977aa-563f-40fd-a592-224a5f6afbd6';
let currentAddonId = 'addon_1eef66a7-6840-4050-a484-2f7dc14dfded';

describe('link-command', function () {
  this.timeout(10000);
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await Promise.all([support.deleteApplications(), support.deleteAddons()]);
  });

  it('list app links', async () => {
    console.log(await support.client.send(new ListLinkCommand({ applicationId: currentApplicationId })));

    await support.client.send(
      new RemoveLinkCommand({ applicationId: currentApplicationId, targetAddonId: currentAddonId }),
    );
    console.log(await support.client.send(new ListLinkCommand({ applicationId: currentApplicationId })));

    await support.client.send(
      new AddLinkCommand({ applicationId: currentApplicationId, targetAddonId: currentAddonId }),
    );
    console.log(await support.client.send(new ListLinkCommand({ applicationId: currentApplicationId })));

    await support.client.send(
      new RemoveLinkCommand({
        applicationId: currentApplicationId,
        targetApplicationId: 'app_7c6f466c-3314-4753-9e06-f87912f6b856',
      }),
    );
    console.log(await support.client.send(new ListLinkCommand({ applicationId: currentApplicationId })));

    await support.client.send(
      new AddLinkCommand({
        applicationId: currentApplicationId,
        targetApplicationId: 'app_7c6f466c-3314-4753-9e06-f87912f6b856',
      }),
    );
    console.log(await support.client.send(new ListLinkCommand({ applicationId: currentApplicationId })));
  });

  it('list addon links', async () => {
    console.log(await support.client.send(new ListLinkCommand({ addonId: currentAddonId })));
  });
});
