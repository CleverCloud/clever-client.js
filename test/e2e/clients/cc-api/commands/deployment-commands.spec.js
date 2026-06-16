import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DeployApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/deploy-application-command.js';
import { CancelDeploymentCommand } from '../../../../../src/clients/cc-api/commands/deployment/cancel-deployment-command.js';
import {
  GetDeploymentCommand,
  GetDeploymentCommandLegacy,
} from '../../../../../src/clients/cc-api/commands/deployment/get-deployment-command.js';
import { ListDeploymentCommand } from '../../../../../src/clients/cc-api/commands/deployment/list-deployment-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { retry } from '../../../../lib/retry.js';
import { e2eSupport } from '../e2e-support.js';

describe('deployment commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteApplications();
  });

  it('should list all org deployments', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));
    await waitForDeployment(application.id, deployment.deploymentId);

    const deployments = await support.client.send(
      new ListDeploymentCommand({
        ownerId: support.organisationId,
      }),
    );

    expect(deployments).toBeInstanceOf(Array);
    expect(deployments).toHaveLength(1);
    expect(deployments[0].id).toBe(deployment.deploymentId);
    expect(deployments[0].applicationId).toBe(application.id);
    expect(deployments[0].index).toBe(1);
    checkDateFormat(deployments[0].date);
    expect(deployments[0].state).toBeTypeOf('string');
    expect(deployments[0].action).toBe('DEPLOY');
    expect(deployments[0].cause).toBeTypeOf('string');
    expect(deployments[0].instances).toBe(1);
    expect(deployments[0].author.id).toBe(support.userId);
  });

  it('should list all app deployments', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));
    await waitForDeployment(application.id, deployment.deploymentId);

    const deployments = await support.client.send(
      new ListDeploymentCommand({
        applicationId: application.id,
        limit: 1,
      }),
    );

    expect(deployments).toBeInstanceOf(Array);
    expect(deployments).toHaveLength(1);
    expect(deployments[0].id).toBe(deployment.deploymentId);
    expect(deployments[0].applicationId).toBe(application.id);
    expect(deployments[0].index).toBe(1);
    checkDateFormat(deployments[0].date);
    expect(deployments[0].state).toBeTypeOf('string');
    expect(deployments[0].action).toBe('DEPLOY');
    expect(deployments[0].cause).toBeTypeOf('string');
    expect(deployments[0].instances).toBe(1);
    expect(deployments[0].author.id).toBe(support.userId);
  });

  it('should get legacy deployment', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));
    await waitForDeployment(application.id, deployment.deploymentId);

    const response = await support.client.send(
      new GetDeploymentCommandLegacy({
        applicationId: application.id,
        deploymentId: deployment.deploymentId,
      }),
    );

    expect(response.id).toBe(deployment.deploymentId);
    expect(response.applicationId).toBe(application.id);
    expect(response.index).toBe(1);
    checkDateFormat(response.date);
    expect(response.state).toBeTypeOf('string');
    expect(response.action).toBe('DEPLOY');
    expect(response.cause).toBeTypeOf('string');
    expect(response.instances).toBe(1);
    expect(response.author.id).toBe(support.userId);
  });

  it('should get deployment', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    const response = await retry(
      () =>
        support.client.send(
          new GetDeploymentCommand({
            applicationId: application.id,
            deploymentId: deployment.deploymentId,
          }),
        ),
      { interval: 500, delay: 1000, timeout: 5000 },
    );

    expect(response.id).toBe(deployment.deploymentId);
    expect(response.applicationId).toBe(application.id);
    checkDateFormat(response.startDate);
    expect(response.state).toBeTypeOf('string');
    expect(response.steps).toBeInstanceOf(Array);
    expect(response.steps[0].state).toBe('QUEUED');
    checkDateFormat(response.steps[0].date);
    expect(response.steps).toBeInstanceOf(Array);
    expect(response.origin.action).toBe('DEPLOY');
    expect(response.origin.cause).toBeTypeOf('string');
    expect(response.origin.source).toBeTypeOf('string');
    expect(response.origin.authorId).toBe(support.userId);
    expect(response.origin.constraints).toBeInstanceOf(Array);
    expect(response.origin.priority).toBeTypeOf('string');
    expect(response.hasDedicatedBuild).toBeTypeOf('boolean');
  });

  it('should cancel deployment', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));
    await waitForDeployment(application.id, deployment.deploymentId);

    const response = await support.client.send(
      new CancelDeploymentCommand({
        applicationId: application.id,
        deploymentId: deployment.deploymentId,
      }),
    );

    expect(response).toBeNull();
  });

  /**
   * @param {string} applicationId
   * @param {string} deploymentId
   * @returns {Promise<void>}
   */
  async function waitForDeployment(applicationId, deploymentId) {
    await retry(() => support.client.send(new GetDeploymentCommand({ applicationId, deploymentId })), {
      interval: 500,
      delay: 1000,
      timeout: 5000,
    });
  }
});
