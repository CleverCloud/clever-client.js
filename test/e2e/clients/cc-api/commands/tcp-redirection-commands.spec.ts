import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CreateTcpRedirectionCommand } from '../../../../../src/clients/cc-api/commands/tcp-redirection/create-tcp-redirection-command.js';
import { DeleteTcpRedirectionCommand } from '../../../../../src/clients/cc-api/commands/tcp-redirection/delete-tcp-redirection-command.js';
import { ListTcpRedirectionCommand } from '../../../../../src/clients/cc-api/commands/tcp-redirection/list-tcp-redirection-command.js';
import { ListTcpRedirectionNamespaceCommand } from '../../../../../src/clients/cc-api/commands/tcp-redirection/list-tcp-redirection-namespace-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('tcp redirection commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should create tcp redirection', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(
      new CreateTcpRedirectionCommand({ applicationId: application.id, namespace: 'default' }),
    );

    expect(response.namespace).toBe('default');
    expect(response.port).toBeTypeOf('number');
  });

  it('should list tcp redirections', async () => {
    const application = await support.createTestApplication();
    const tcpRedirection1 = await support.client.send(
      new CreateTcpRedirectionCommand({ applicationId: application.id, namespace: 'default' }),
    );
    const tcpRedirection2 = await support.client.send(
      new CreateTcpRedirectionCommand({ applicationId: application.id, namespace: 'cleverapps' }),
    );

    const response = await support.client.send(new ListTcpRedirectionCommand({ applicationId: application.id }));

    expect(response).toHaveLength(2);
    expect(response).toEqualInAnyOrder([
      { namespace: 'default', port: tcpRedirection1.port },
      { namespace: 'cleverapps', port: tcpRedirection2.port },
    ]);
  });

  it('should delete tcp redirection', async () => {
    const application = await support.createTestApplication();
    const tcpRedirection = await support.client.send(
      new CreateTcpRedirectionCommand({ applicationId: application.id, namespace: 'default' }),
    );

    const response = await support.client.send(
      new DeleteTcpRedirectionCommand({
        applicationId: application.id,
        namespace: 'default',
        port: tcpRedirection.port,
      }),
    );

    expect(response).toBeNull();
  });

  it('should list tcp redirection namespaces', async () => {
    const response = await support.client.send(
      new ListTcpRedirectionNamespaceCommand({ ownerId: support.organisationId }),
    );

    expect(response).toHaveLength(2);
    expect(response).toEqualInAnyOrder([{ namespace: 'cleverapps' }, { namespace: 'default' }]);
  });
});
