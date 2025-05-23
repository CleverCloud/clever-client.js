import { expect } from 'chai';
import { CreateAddonCommand } from '../../../../../src/clients/api/commands/addon/create-addon-command.js';
import { DeleteAddonCommand } from '../../../../../src/clients/api/commands/addon/delete-addon-command.js';
import { ListAddonCommand } from '../../../../../src/clients/api/commands/addon/list-addon-command.js';
import { DEFAULT_OWNER_ID, getCcApiClient } from '../../../../lib/cc-api-client.js';

describe('create-addon-command', function () {
  this.timeout(10000);

  afterEach(async () => {
    // delete all addons
    const addons = await getCcApiClient().send(new ListAddonCommand({ ownerId: DEFAULT_OWNER_ID }));
    await Promise.all(addons.map((addon) => getCcApiClient().send(new DeleteAddonCommand({ addonId: addon.id }))));
  });

  it('should create addon', async () => {
    const addon = await getCcApiClient().send(
      new CreateAddonCommand({
        ownerId: DEFAULT_OWNER_ID,
        name: 'my-test-addon',
        providerId: 'mysql-addon',
        planId: 'plan_bf78ef5b-aedd-4024-973a-c2ff45541b88', //DEV plan
        region: 'mtl',
        options: {},
      }),
    );

    expect(new Date(addon.creationDate).toISOString()).to.equal(addon.creationDate);
    expect(addon.id).to.match(/addon_.+/);
    expect(addon.realId).to.match(/mysql_.+/);
    expect(addon.name).to.equal('my-test-addon');
    expect(addon.region).to.equal('mtl');
    expect(addon.plan.id).to.match(/plan_.+/);
    expect(addon.provider.id).to.equal('mysql-addon');
  });
});
