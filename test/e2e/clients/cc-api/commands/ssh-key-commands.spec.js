import { expect } from 'chai';
import { CreatePersonalSshKeyCommand } from '../../../../../src/clients/cc-api/commands/ssh-key/create-personal-ssh-key-command.js';
import { DeletePersonalSshKeyCommand } from '../../../../../src/clients/cc-api/commands/ssh-key/delete-personal-ssh-key-command.js';
import { ListGithubSshKeyCommand } from '../../../../../src/clients/cc-api/commands/ssh-key/list-github-ssh-key-command.js';
import { ListPersonalSshKeyCommand } from '../../../../../src/clients/cc-api/commands/ssh-key/list-personal-ssh-key-command.js';
import { e2eSupport } from '../e2e-support.js';

const SSH_KEY = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFKttpn0/QsZEPeH+MsCNvWPakMx1ZJyylMXCyyOheGO';

describe('ssh-key commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    const sshKeys = await support.client.send(new ListPersonalSshKeyCommand());
    await Promise.all(sshKeys.map((sshKey) => support.client.send(new DeletePersonalSshKeyCommand(sshKey))));
  });

  it('should list personal ssh key', async () => {
    await support.client.send(new CreatePersonalSshKeyCommand({ name: 'test-key', key: SSH_KEY }));

    const response = await support.client.send(new ListPersonalSshKeyCommand());

    expect(response).to.have.lengthOf(1);
    expect(response[0].name).to.equal('test-key');
    expect(response[0].key).to.equal(SSH_KEY);
    expect(response[0].fingerprint).to.equal('SHA256:DyN4OQASCMlvIeJ4U6v0KPBmeEgxCFmfP2UQ987P6Ww');
  });

  it('should create personal ssh key', async () => {
    const response = await support.client.send(new CreatePersonalSshKeyCommand({ name: 'test-key', key: SSH_KEY }));

    expect(response.name).to.equal('test-key');
    expect(response.key).to.equal(SSH_KEY);
    expect(response.fingerprint).to.equal('SHA256:DyN4OQASCMlvIeJ4U6v0KPBmeEgxCFmfP2UQ987P6Ww');
  });

  it('should delete personal ssh key', async () => {
    await support.client.send(new CreatePersonalSshKeyCommand({ name: 'test-key', key: SSH_KEY }));

    const response = await support.client.send(new DeletePersonalSshKeyCommand({ name: 'test-key' }));

    expect(response).to.be.null;
  });

  it('should list github ssh key', async () => {
    const response = await support.client.send(new ListGithubSshKeyCommand());

    expect(response).to.have.lengthOf(1);
    expect(response[0].name).to.equal('test-ssh-key');
    expect(response[0].key).to.equal(SSH_KEY);
    expect(response[0].fingerprint).to.equal('SHA256:DyN4OQASCMlvIeJ4U6v0KPBmeEgxCFmfP2UQ987P6Ww');
  });
});
