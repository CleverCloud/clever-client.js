import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { CreatePersonalSshKeyCommand } from '../../../../../src/clients/cc-api/commands/ssh-key/create-personal-ssh-key-command.js';
import { DeletePersonalSshKeyCommand } from '../../../../../src/clients/cc-api/commands/ssh-key/delete-personal-ssh-key-command.js';
import { ListGithubSshKeyCommand } from '../../../../../src/clients/cc-api/commands/ssh-key/list-github-ssh-key-command.js';
import { ListPersonalSshKeyCommand } from '../../../../../src/clients/cc-api/commands/ssh-key/list-personal-ssh-key-command.js';
import { e2eSupport } from '../e2e-support.js';

const SSH_KEY = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFKttpn0/QsZEPeH+MsCNvWPakMx1ZJyylMXCyyOheGO';

describe('ssh-key commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    const sshKeys = await support.client.send(new ListPersonalSshKeyCommand());
    await Promise.all(sshKeys.map((sshKey) => support.client.send(new DeletePersonalSshKeyCommand(sshKey))));
  });

  it('should list personal ssh key', async () => {
    await support.client.send(new CreatePersonalSshKeyCommand({ name: 'test-key', key: SSH_KEY }));

    const response = await support.client.send(new ListPersonalSshKeyCommand());

    expect(response).toHaveLength(1);
    expect(response[0].name).toBe('test-key');
    expect(response[0].key).toBe(SSH_KEY);
    expect(response[0].fingerprint).toBe('SHA256:DyN4OQASCMlvIeJ4U6v0KPBmeEgxCFmfP2UQ987P6Ww');
  });

  it('should create personal ssh key', async () => {
    const response = await support.client.send(new CreatePersonalSshKeyCommand({ name: 'test-key', key: SSH_KEY }));

    expect(response.name).toBe('test-key');
    expect(response.key).toBe(SSH_KEY);
    expect(response.fingerprint).toBe('SHA256:DyN4OQASCMlvIeJ4U6v0KPBmeEgxCFmfP2UQ987P6Ww');
  });

  it('should delete personal ssh key', async () => {
    await support.client.send(new CreatePersonalSshKeyCommand({ name: 'test-key', key: SSH_KEY }));

    const response = await support.client.send(new DeletePersonalSshKeyCommand({ name: 'test-key' }));

    expect(response).toBeNull();
  });

  it('should list github ssh key', async () => {
    const response = await support.client.send(new ListGithubSshKeyCommand());

    expect(response).toHaveLength(1);
    expect(response[0].name).toBe('test-ssh-key');
    expect(response[0].key).toBe(SSH_KEY);
    expect(response[0].fingerprint).toBe('SHA256:DyN4OQASCMlvIeJ4U6v0KPBmeEgxCFmfP2UQ987P6Ww');
  });
});
