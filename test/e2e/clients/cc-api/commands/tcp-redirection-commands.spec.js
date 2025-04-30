import { expect } from 'chai';
import { CreateTcpRedirectionCommand } from '../../../../../src/clients/cc-api/commands/tcp-redirection/create-tcp-redirection-command.js';
import { DeleteTcpRedirectionCommand } from '../../../../../src/clients/cc-api/commands/tcp-redirection/delete-tcp-redirection-command.js';
import { ListTcpRedirectionCommand } from '../../../../../src/clients/cc-api/commands/tcp-redirection/list-tcp-redirection-command.js';
import { ListTcpRedirectionNamespaceCommand } from '../../../../../src/clients/cc-api/commands/tcp-redirection/list-tcp-redirection-namespace-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('tcp redirection commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should create tcp redirection', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(
      new CreateTcpRedirectionCommand({ applicationId: application.id, namespace: 'default' }),
    );

    expect(response.namespace).to.equal('default');
    expect(response.port).to.be.a('number');
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

    expect(response).to.have.lengthOf(2);
    expect(response).to.deep.equalInAnyOrder([
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

    expect(response).to.be.null;
  });

  it('should list tcp redirection namespaces', async () => {
    const response = await support.client.send(
      new ListTcpRedirectionNamespaceCommand({ ownerId: support.organisationId }),
    );

    expect(response).to.have.lengthOf(2);
    expect(response).to.deep.equalInAnyOrder([{ namespace: 'cleverapps' }, { namespace: 'default' }]);
  });
});
