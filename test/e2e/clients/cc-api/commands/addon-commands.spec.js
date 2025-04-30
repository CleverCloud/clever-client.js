import { expect } from 'chai';
import { DeleteAddonCommand } from '../../../../../src/clients/cc-api/commands/addon/delete-addon-command.js';
import { GetAddonCommand } from '../../../../../src/clients/cc-api/commands/addon/get-addon-command.js';
import { GetAddonSsoCommand } from '../../../../../src/clients/cc-api/commands/addon/get-addon-sso-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('addon commands', function () {
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

    checkDateFormat(response.creationDate);
    expect(response.id).to.match(/addon_.+/);
    expect(response.realId).to.match(/config_.+/);
    expect(response.name).to.equal('test-addon');
    expect(response.zone).to.equal('par');
    expect(response.plan.id).to.match(/plan_.+/);
    expect(response.provider.id).to.equal('config-provider');
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
