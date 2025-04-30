import { expect } from 'chai';
import { DeleteApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/delete-application-command.js';
import { DeployApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/deploy-application-command.js';
import { GetApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/get-application-command.js';
import { ListApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/list-application-command.js';
import { UndeployApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/undeploy-application-command.js';
import { UpdateApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/update-application-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('application commands', function () {
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

  it('should create application', async () => {
    const application = await support.createTestApplication();

    expect(application.id).to.match(/app_.+/);
    expect(application.ownerId).to.equal(support.organisationId);
    expect(application.zone).to.equal('par');
  });

  it('should deploy application', async () => {
    const application = await support.createTestApplication();

    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    expect(deployment.deploymentId).to.match(/deployment_.+/);
  });

  it('should undeploy application', async () => {
    const application = await support.createTestApplication();
    await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    const response = await support.client.send(new UndeployApplicationCommand({ applicationId: application.id }));

    expect(response).to.be.null;
  });

  it('should update buildFlavor', async () => {
    const application = await support.createTestApplication();

    const updatedApplication = await support.client.send(
      new UpdateApplicationCommand({
        ownerId: support.organisationId,
        applicationId: application.id,
        buildFlavor: 'L',
      }),
    );

    expect(updatedApplication.buildFlavor.name).to.equal('L');
  });

  it('should update branch', async () => {
    const application = await support.createTestApplication();

    const updatedApplication = await support.client.send(
      new UpdateApplicationCommand({
        ownerId: support.organisationId,
        applicationId: application.id,
        branch: 'test',
      }),
    );

    expect(updatedApplication.branch).to.equal('test');
  });

  it('should delete application', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(new DeleteApplicationCommand({ applicationId: application.id }));

    expect(response).to.be.null;
  });

  it('should get application', async () => {
    const application = await support.createTestApplication();
    const response = await support.client.send(
      new GetApplicationCommand({ applicationId: application.id, withBranches: true }),
    );

    expect(response).to.deep.equalInAnyOrder(application);
  });

  it('should list applications', async () => {
    const application1 = await support.createTestApplication('app1');
    const application2 = await support.createTestApplication('app2');

    const response = await support.client.send(
      new ListApplicationCommand({ ownerId: support.organisationId, withBranches: true }),
    );

    expect(response).to.deep.equalInAnyOrder([application1, application2]);
  });

  it('should list applications empty', async () => {
    const response = await support.client.send(
      new ListApplicationCommand({ ownerId: support.organisationId, withBranches: false }),
    );

    expect(response).to.have.length(0);
  });
});
