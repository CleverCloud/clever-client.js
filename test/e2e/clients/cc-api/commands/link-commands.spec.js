import { expect } from 'chai';
import { AddLinkCommand } from '../../../../../src/clients/cc-api/commands/link/add-link-command.js';
import { ListLinkCommand } from '../../../../../src/clients/cc-api/commands/link/list-link-command.js';
import { RemoveLinkCommand } from '../../../../../src/clients/cc-api/commands/link/remove-link-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('link commands', function () {
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

  it('should add link between two applications', async () => {
    const [application1, application2] = await Promise.all([
      support.createTestApplication(),
      support.createTestApplication(),
    ]);

    const response = await support.client.send(
      new AddLinkCommand({ applicationId: application1.id, targetApplicationId: application2.id }),
    );

    expect(response).to.be.null;
  });

  it('should add link between an application and an addon', async () => {
    const [application, addon] = await Promise.all([support.createTestApplication(), support.createTestAddon()]);

    const response = await support.client.send(
      new AddLinkCommand({ applicationId: application.id, targetAddonId: addon.id }),
    );

    expect(response).to.be.null;
  });

  it('should list application links', async () => {
    const [application1, application2, addon] = await Promise.all([
      support.createTestApplication(),
      support.createTestApplication(),
      support.createTestAddon(),
    ]);
    await Promise.all([
      support.client.send(new AddLinkCommand({ applicationId: application1.id, targetApplicationId: application2.id })),
      support.client.send(new AddLinkCommand({ applicationId: application1.id, targetAddonId: addon.id })),
    ]);

    const response = await support.client.send(new ListLinkCommand({ applicationId: application1.id }));

    expect(response).to.be.an('array');
    expect(response).to.have.lengthOf(2);
    expect(response[0].type).to.equal('link-to-application');
    expect(response[0]).to.ownProperty('application');
    // @ts-ignore
    expect(response[0].application.id).to.equal(application2.id);

    expect(response[1].type).to.equal('link-to-addon');
    expect(response[1]).to.ownProperty('addon');
    // @ts-ignore
    expect(response[1].addon.id).to.equal(addon.id);
  });

  it('should list addon links', async () => {
    const [application1, application2, addon] = await Promise.all([
      support.createTestApplication(),
      support.createTestApplication(),
      support.createTestAddon(),
    ]);
    await Promise.all([
      support.client.send(new AddLinkCommand({ applicationId: application1.id, targetAddonId: addon.id })),
      support.client.send(new AddLinkCommand({ applicationId: application2.id, targetAddonId: addon.id })),
    ]);

    const response = await support.client.send(new ListLinkCommand({ addonId: addon.id }));

    expect(response).to.be.an('array');
    expect(response).to.have.lengthOf(2);
    // @ts-ignore
    expect(response.map((l) => ({ type: l.type, id: l.application.id }))).to.deep.equalInAnyOrder([
      { type: 'link-to-application', id: application1.id },
      { type: 'link-to-application', id: application2.id },
    ]);
  });

  it('should remove link to application', async () => {
    const [application1, application2] = await Promise.all([
      support.createTestApplication(),
      support.createTestApplication(),
    ]);
    await support.client.send(
      new AddLinkCommand({ applicationId: application1.id, targetApplicationId: application2.id }),
    );

    const response = await support.client.send(
      new RemoveLinkCommand({ applicationId: application1.id, targetApplicationId: application2.id }),
    );

    expect(response).to.be.null;
  });

  it('should remove link to addon', async () => {
    const [application, addon] = await Promise.all([support.createTestApplication(), support.createTestAddon()]);
    await support.client.send(new AddLinkCommand({ applicationId: application.id, targetAddonId: addon.id }));

    const response = await support.client.send(
      new RemoveLinkCommand({ applicationId: application.id, targetAddonId: addon.id }),
    );

    expect(response).to.be.null;
  });
});
