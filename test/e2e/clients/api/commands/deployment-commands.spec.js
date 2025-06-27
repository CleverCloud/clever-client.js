import { DeployApplicationCommand } from '../../../../../src/clients/api/commands/application/deploy-application-command.js';
import { ListDeploymentCommand } from '../../../../../src/clients/api/commands/deployment/list-deployment-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('deployment-commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteApplications();
  });

  it('should list all org deployments', async () => {
    const application = await support.createTestApplication();
    await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    const deployments = await support.client.send(
      new ListDeploymentCommand({
        ownerId: support.organisationId,
      }),
    );

    console.log(deployments);
  });

  it('should list all app deployments', async () => {
    const application = await support.createTestApplication();
    await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    const deployments = await support.client.send(
      new ListDeploymentCommand({
        applicationId: application.id,
        limit: 1,
      }),
    );

    console.log(deployments);
  });
});
