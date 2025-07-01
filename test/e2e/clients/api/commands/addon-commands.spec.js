import { expect } from 'chai';
import { DeleteAddonCommand } from '../../../../../src/clients/api/commands/addon/delete-addon-command.js';
import { GetAddonCommand } from '../../../../../src/clients/api/commands/addon/get-addon-command.js';
import { GetAddonSsoCommand } from '../../../../../src/clients/api/commands/addon/get-addon-sso-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('addon commands', function () {
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

  it('should create addon', async () => {
    const response = await support.createTestAddon();

    expect(new Date(response.creationDate).toISOString()).to.equal(response.creationDate);
    expect(response.id).to.match(/addon_.+/);
    expect(response.realId).to.match(/mysql_.+/);
    expect(response.name).to.equal('test-addon');
    expect(response.zone).to.equal('par');
    expect(response.plan.id).to.match(/plan_.+/);
    expect(response.provider.id).to.equal('mysql-addon');

    console.log(response);

    const addon = await support.client.send(new GetAddonCommand({ addonId: response.id }));
    expect(addon).to.not.be.null;
    expect(addon.id).to.equal(addon.id);
  });

  it('should delete addon', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(new DeleteAddonCommand({ addonId: addon.id }));
    expect(response).to.be.null;
  });

  it('should get addon null', async () => {
    const response = await support.client.send(
      new GetAddonCommand({ ownerId: support.organisationId, addonId: 'addon_00000000-0000-0000-0000-000000000000' }),
    );
    expect(response).to.be.null;
  });

  it('should get addon', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(
      new GetAddonCommand({ ownerId: support.organisationId, addonId: addon.id }),
    );
    expect(response).to.deep.equalInAnyOrder(addon);
  });

  it('should get addon sso null', async () => {
    const response = await support.client.send(
      new GetAddonSsoCommand({
        ownerId: support.organisationId,
        addonId: 'addon_00000000-0000-0000-0000-000000000000',
      }),
    );

    expect(response).to.be.null;
  });

  it('should get addon sso', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(
      new GetAddonSsoCommand({ ownerId: support.organisationId, addonId: addon.id }),
    );

    expect(response.url).to.be.a('string');
    expect(response.id).to.equal(addon.realId);
    expect(response.timestamp).to.be.a('number');
    expect(response.token).to.be.a('string');
    expect(response.signature).to.be.a('string');
    expect(response.email).to.be.a('string');
    expect(response.userId).to.equal(support.organisationId);
  });
});
