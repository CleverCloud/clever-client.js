import { expect } from 'chai';
import { DeployApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/deploy-application-command.js';
import { CancelDeploymentCommand } from '../../../../../src/clients/cc-api/commands/deployment/cancel-deployment-command.js';
import {
  GetDeploymentCommand,
  GetDeploymentCommandLegacy,
} from '../../../../../src/clients/cc-api/commands/deployment/get-deployment-command.js';
import { ListDeploymentCommand } from '../../../../../src/clients/cc-api/commands/deployment/list-deployment-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { sleep } from '../../../../lib/timers.js';
import { e2eSupport } from '../e2e-support.js';

describe('deployment commands', function () {
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
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    // may be not enough when infrastructure is slow. todo: introduce a retry mechanism instead of this horrible sleep
    await sleep(2000);

    const deployments = await support.client.send(
      new ListDeploymentCommand({
        ownerId: support.organisationId,
      }),
    );

    expect(deployments).to.be.an('array');
    expect(deployments).to.have.lengthOf(1);
    expect(deployments[0].id).to.equal(deployment.deploymentId);
    expect(deployments[0].applicationId).to.equal(application.id);
    expect(deployments[0].index).to.equal(1);
    checkDateFormat(deployments[0].date);
    expect(deployments[0].state).to.be.a('string');
    expect(deployments[0].action).to.equal('DEPLOY');
    expect(deployments[0].cause).to.be.a('string');
    expect(deployments[0].instances).to.equal(1);
    expect(deployments[0].author.id).to.equal(support.userId);
  });

  it('should list all app deployments', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    // may be not enough when infrastructure is slow. todo: introduce a retry mechanism instead of this horrible sleep
    await sleep(2000);

    const deployments = await support.client.send(
      new ListDeploymentCommand({
        applicationId: application.id,
        limit: 1,
      }),
    );

    expect(deployments).to.be.an('array');
    expect(deployments).to.have.lengthOf(1);
    expect(deployments[0].id).to.equal(deployment.deploymentId);
    expect(deployments[0].applicationId).to.equal(application.id);
    expect(deployments[0].index).to.equal(1);
    checkDateFormat(deployments[0].date);
    expect(deployments[0].state).to.be.a('string');
    expect(deployments[0].action).to.equal('DEPLOY');
    expect(deployments[0].cause).to.be.a('string');
    expect(deployments[0].instances).to.equal(1);
    expect(deployments[0].author.id).to.equal(support.userId);
  });

  it('should get legacy deployment', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    // may be not enough when infrastructure is slow. todo: introduce a retry mechanism instead of this horrible sleep
    await sleep(2000);

    const response = await support.client.send(
      new GetDeploymentCommandLegacy({
        applicationId: application.id,
        deploymentId: deployment.deploymentId,
      }),
    );

    expect(response.id).to.equal(deployment.deploymentId);
    expect(response.applicationId).to.equal(application.id);
    expect(response.index).to.equal(1);
    checkDateFormat(response.date);
    expect(response.state).to.be.a('string');
    expect(response.action).to.equal('DEPLOY');
    expect(response.cause).to.be.a('string');
    expect(response.instances).to.equal(1);
    expect(response.author.id).to.equal(support.userId);
  });

  it('should get deployment', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    // may be not enough when infrastructure is slow. todo: introduce a retry mechanism instead of this horrible sleep
    await sleep(2000);

    const response = await support.client.send(
      new GetDeploymentCommand({
        applicationId: application.id,
        deploymentId: deployment.deploymentId,
      }),
    );

    expect(response.id).to.equal(deployment.deploymentId);
    expect(response.applicationId).to.equal(application.id);
    checkDateFormat(response.startDate);
    expect(response.state).to.be.a('string');
    expect(response.steps).to.be.an('array');
    expect(response.steps[0].state).to.equal('QUEUED');
    checkDateFormat(response.steps[0].date);
    expect(response.steps).to.be.an('array');
    expect(response.origin.action).to.equal('DEPLOY');
    expect(response.origin.cause).to.be.a('string');
    expect(response.origin.source).to.be.a('string');
    expect(response.origin.authorId).to.equal(support.userId);
    expect(response.origin.constraints).to.be.an('array');
    expect(response.origin.priority).to.be.a('string');
    expect(response.hasDedicatedBuild).to.be.a('boolean');
  });

  it('should cancel deployment', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    // may be not enough when infrastructure is slow. todo: introduce a retry mechanism instead of this horrible sleep
    await sleep(2000);

    const response = await support.client.send(
      new CancelDeploymentCommand({
        applicationId: application.id,
        deploymentId: deployment.deploymentId,
      }),
    );

    expect(response).to.be.null;
  });
});
