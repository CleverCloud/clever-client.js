import { expect } from 'chai';
import { CheckMetabaseVersionCommand } from '../../../../../src/clients/cc-api/commands/metabase/check-metabase-version-command.js';
import { GetMetabaseInfoCommand } from '../../../../../src/clients/cc-api/commands/metabase/get-metabase-info-command.js';
import { RebootMetabaseCommand } from '../../../../../src/clients/cc-api/commands/metabase/reboot-metabase-command.js';
import { RebuildMetabaseCommand } from '../../../../../src/clients/cc-api/commands/metabase/rebuild-metabase-command.js';
import { UpdateMetabaseVersionCommand } from '../../../../../src/clients/cc-api/commands/metabase/update-metabase-version-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('metabase commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  afterEach(async () => {
    await support.deleteAddons();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should get metabase info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-metabase-addon',
      providerId: 'metabase',
      planId: 'plan_2925d534-7155-4521-8052-d068d7ce8915',
    });
    const response = await support.client.send(new GetMetabaseInfoCommand({ addonId: addon.id }));

    expect(response.id).to.equal(addon.realId);
    expect(response.addonId).to.equal(addon.id);
    expect(response.name).to.equal(addon.name);
    expect(response.ownerId).to.equal(support.organisationId);
    expect(response.plan).to.be.a('string');
    expect(response.version).to.be.a('string');
    expect(response.javaVersion).to.be.a('string');
    expect(response.accessUrl).to.be.a('string');
    expect(response.availableVersions).to.be.an('array');
    expect(response.resources.entrypoint).to.be.a('string');
    expect(response.resources.pgsqlId).to.be.a('string');
    expect(response.environment).to.be.an('array');
  });

  it('should reboot metabase', async () => {
    const addon = await support.createTestAddon({
      name: 'test-metabase-addon',
      providerId: 'metabase',
      planId: 'plan_2925d534-7155-4521-8052-d068d7ce8915',
    });
    const response = await support.client.send(new RebootMetabaseCommand({ addonId: addon.id }));

    expect(response).to.be.null;
  });

  it('should rebuild metabase', async () => {
    const addon = await support.createTestAddon({
      name: 'test-metabase-addon',
      providerId: 'metabase',
      planId: 'plan_2925d534-7155-4521-8052-d068d7ce8915',
    });
    const response = await support.client.send(new RebuildMetabaseCommand({ addonId: addon.id }));

    expect(response).to.be.null;
  });

  it('should check metabase version', async () => {
    const addon = await support.createTestAddon({
      name: 'test-metabase-addon',
      providerId: 'metabase',
      planId: 'plan_2925d534-7155-4521-8052-d068d7ce8915',
    });
    const response = await support.client.send(new CheckMetabaseVersionCommand({ addonId: addon.id }));

    expect(response.installed).to.be.a('string');
    expect(response.latest).to.be.a('string');
    expect(response.available).to.be.an('array').that.includes(response.latest);
    expect(response.needUpdate).to.be.a('boolean');
  });

  it('should update metabase version', async () => {
    const addon = await support.createTestAddon({
      name: 'test-metabase-addon',
      providerId: 'metabase',
      planId: 'plan_2925d534-7155-4521-8052-d068d7ce8915',
    });
    const info = await support.client.send(new GetMetabaseInfoCommand({ addonId: addon.id }));

    const response = await support.client.send(
      new UpdateMetabaseVersionCommand({ addonId: addon.id, targetVersion: info.version }),
    );

    expect(response.id).to.equal(addon.realId);
    expect(response.version).to.be.a('string');
    expect(response.environment).to.be.an('array');
  });
});
