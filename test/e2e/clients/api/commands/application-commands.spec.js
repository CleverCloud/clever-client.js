import { expect } from 'chai';
import { CreateApplicationCommand } from '../../../../../src/clients/api/commands/application/create-application-command.js';
import { DeleteApplicationCommand } from '../../../../../src/clients/api/commands/application/delete-application-command.js';
import { DeployApplicationCommand } from '../../../../../src/clients/api/commands/application/deploy-application-command.js';
import { ListApplicationCommand } from '../../../../../src/clients/api/commands/application/list-application-command.js';
import { UndeployApplicationCommand } from '../../../../../src/clients/api/commands/application/undeploy-application-command.js';
import { UpdateApplicationCommand } from '../../../../../src/clients/api/commands/application/update-application-command.js';
import { DEFAULT_OWNER_ID, getCcApiClient } from '../../../../lib/cc-api-client.js';

describe('application-commands', function () {
  this.timeout(10000);

  afterEach(async () => {
    // delete all applications
    const applications = await getCcApiClient().send(new ListApplicationCommand({ ownerId: DEFAULT_OWNER_ID }));
    await Promise.all(
      applications.map((application) =>
        getCcApiClient().send(new DeleteApplicationCommand({ applicationId: application.id })),
      ),
    );
  });

  it('should create application', async () => {
    const application = await getCcApiClient().send(
      new CreateApplicationCommand({
        ownerId: DEFAULT_OWNER_ID,
        name: 'my-test-application-3',
        zone: 'par',
        minInstances: 1,
        maxInstances: 1,
        minFlavor: 'xs',
        maxFlavor: 'xs',
        buildFlavor: 's',
        instance: { slug: 'node' },
        deploy: 'git',
        branch: 'master',
        env: {
          ENV_VAR_1: 'value1',
          ENV_VAR_2: 'value2',
        },
      }),
    );

    console.log(application);
    expect(application.id).to.match(/app_.+/);
  });

  async function getApplicationId() {
    const application = await getCcApiClient().send(
      new CreateApplicationCommand({
        ownerId: DEFAULT_OWNER_ID,
        name: 'my-test-application-3',
        zone: 'par',
        minInstances: 1,
        maxInstances: 1,
        minFlavor: 'xs',
        maxFlavor: 'xs',
        buildFlavor: 's',
        separateBuild: true,
        instance: { slug: 'node' },
        deploy: 'git',
        branch: 'master',
        env: {
          ENV_VAR_1: 'value1',
          ENV_VAR_2: 'value2',
        },
      }),
    );

    return application.id;
  }

  it('should deploy application', async () => {
    const applicationId = await getApplicationId();

    const deployment = await getCcApiClient().send(new DeployApplicationCommand({ applicationId }));

    console.log(deployment);
    expect(deployment.deploymentId).to.match(/deployment_.+/);
  });

  it('should undeploy application', async () => {
    const applicationId = await getApplicationId();

    await getCcApiClient().send(new UndeployApplicationCommand({ applicationId }));

    // TODO
  });

  it('should update buildFlavor', async () => {
    const applicationId = await getApplicationId();

    const updatedApplication = await getCcApiClient().send(
      new UpdateApplicationCommand({
        ownerId: DEFAULT_OWNER_ID,
        applicationId,
        buildFlavor: 'l',
      }),
    );

    expect(updatedApplication.buildFlavor.name).to.equal('L');
    console.log(updatedApplication);
  });

  it('should update branch', async () => {
    const applicationId = await getApplicationId();

    const updatedApplication = await getCcApiClient().send(
      new UpdateApplicationCommand({
        ownerId: DEFAULT_OWNER_ID,
        applicationId,
        branch: 'master',
      }),
    );

    // expect(updatedApplication.buildFlavor.name).to.equal('L');
    console.log(updatedApplication);

    // TODO
  });
});
