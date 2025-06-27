import { ListTcpRedirectionNamespaceCommand } from '../../../../../src/clients/api/commands/tcp-redirection/list-tcp-redirection-namespace-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('tag commands', function () {
  this.timeout(10000);

  const support = e2eSupport(false);

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should create tcp redirection', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(
      new CreateTcpRedirectionCommand({ applicationId: application.id, namespace: 'default', port: 6666 }),
    );

    console.log(response);

    expect(response.namespace).to.equal('default');
    expect(response.port).to.equal(6666);
  });

  it('should list tcp redirections', async () => {
    const application = await support.createTestApplication();
    await support.client.send(
      new CreateTcpRedirectionCommand({ applicationId: application.id, namespace: 'default', port: 6666 }),
    );
    await support.client.send(
      new CreateTcpRedirectionCommand({ applicationId: application.id, namespace: 'cleverapps', port: 6667 }),
    );

    const response = await support.client.send(new ListTcpRedirectionCommand({ applicationId: application.id }));

    console.log(response);

    expect(response).to.have.lengthOf(2);
  });

  it('should delete tcp redirection', async () => {
    const application = await support.createTestApplication();
    await support.client.send(
      new CreateTcpRedirectionCommand({ applicationId: application.id, namespace: 'default', port: 6666 }),
    );

    const response = await support.client.send(
      new DeleteTcpRedirection({ applicationId: application.id, namespace: 'default', port: 6666 }),
    );

    console.log(response);

    expect(response).to.be.null;
  });

  it('should list tcp redirection namespaces', async () => {
    const response = await support.client.send(
      new ListTcpRedirectionNamespaceCommand({ ownerId: support.organisationId }),
    );

    expect(response).to.have.lengthOf(2);
    expect(response).to.deep.equalInAnyOrder(['default', 'cleverapps']);
  });
});
