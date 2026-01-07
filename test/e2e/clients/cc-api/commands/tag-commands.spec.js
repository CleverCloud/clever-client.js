import { expect } from 'chai';
import { CreateTagCommand } from '../../../../../src/clients/cc-api/commands/tag/create-tag-command.js';
import { DeleteTagCommand } from '../../../../../src/clients/cc-api/commands/tag/delete-tag-command.js';
import { ListTagCommand } from '../../../../../src/clients/cc-api/commands/tag/list-tag-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('tag commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should create application tag', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(new CreateTagCommand({ applicationId: application.id, tag: 'tag-1' }));

    expect(response).to.have.lengthOf(1);
    expect(response[0]).to.equal('tag-1');
  });

  it('should list application tag', async () => {
    const application = await support.createTestApplication();
    await support.client.send(new CreateTagCommand({ applicationId: application.id, tag: 'tag-1' }));
    await support.client.send(new CreateTagCommand({ applicationId: application.id, tag: 'tag-2' }));

    const response = await support.client.send(new ListTagCommand({ applicationId: application.id }));

    expect(response).to.have.lengthOf(2);
    expect(response).to.deep.equalInAnyOrder(['tag-1', 'tag-2']);
  });

  it('should delete application tag', async () => {
    const application = await support.createTestApplication();
    await support.client.send(new CreateTagCommand({ applicationId: application.id, tag: 'tag-1' }));
    await support.client.send(new CreateTagCommand({ applicationId: application.id, tag: 'tag-2' }));

    const response = await support.client.send(new DeleteTagCommand({ applicationId: application.id, tag: 'tag-1' }));

    expect(response).to.have.lengthOf(1);
    expect(response).to.deep.equalInAnyOrder(['tag-2']);
  });

  it('should create addon tag', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(new CreateTagCommand({ addonId: addon.id, tag: 'tag-1' }));

    expect(response).to.have.lengthOf(1);
    expect(response[0]).to.equal('tag-1');
  });

  it('should list addon tag', async () => {
    const addon = await support.createTestAddon();
    await support.client.send(new CreateTagCommand({ addonId: addon.id, tag: 'tag-1' }));
    await support.client.send(new CreateTagCommand({ addonId: addon.id, tag: 'tag-2' }));

    const response = await support.client.send(new ListTagCommand({ addonId: addon.id }));

    expect(response).to.have.lengthOf(2);
    expect(response).to.deep.equalInAnyOrder(['tag-1', 'tag-2']);
  });

  it('should delete addon tag', async () => {
    const addon = await support.createTestAddon();
    await support.client.send(new CreateTagCommand({ addonId: addon.id, tag: 'tag-1' }));
    await support.client.send(new CreateTagCommand({ addonId: addon.id, tag: 'tag-2' }));

    const response = await support.client.send(new DeleteTagCommand({ addonId: addon.id, tag: 'tag-1' }));

    expect(response).to.have.lengthOf(1);
    expect(response).to.deep.equalInAnyOrder(['tag-2']);
  });
});
