/**
 * @import { Instance } from '../../../../../src/clients/cc-api/commands/instance/instance.types.js';
 */
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DeployApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/deploy-application-command.js';
import { GetApplicationInstanceCommand } from '../../../../../src/clients/cc-api/commands/instance/get-application-instance-command.js';
import { ListApplicationInstanceCommand } from '../../../../../src/clients/cc-api/commands/instance/list-application-instance-command.js';
import { Polling } from '../../../../../src/utils/polling.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('instance commands', { timeout: 60000 }, () => {
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

  it('should list application instances', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    const response = await waitForInstances(application.id);

    expect(response).toBeInstanceOf(Array);
    expect(response[0].id).toBeTypeOf('string');
    expect(response[0].ownerId).toBe(support.organisationId);
    expect(response[0].applicationId).toBe(application.id);
    expect(response[0].deploymentId).toBe(deployment.deploymentId);
    expect(response[0].name).toBeTypeOf('string');
    expect(response[0].flavor).toBe('XS');
    expect(response[0].index).toBe(0);
    expect(response[0].state).toBeTypeOf('string');
    expect(response[0].hypervisorId).toBeTypeOf('string');
    checkDateFormat(response[0].creationDate);
    checkDateFormat(response[0].deletionDate);
    expect(response[0].network.ip).toBeTypeOf('string');
    expect(response[0].network.port).toBeTypeOf('number');
    expect(response[0].isBuildVm).toBe(false);
  });

  it('should get application instance', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    const instances = await waitForInstances(application.id);

    const response = await support.client.send(
      new GetApplicationInstanceCommand({ applicationId: application.id, instanceId: instances[0].id }),
    );

    expect(response.id).toBeTypeOf('string');
    expect(response.ownerId).toBe(support.organisationId);
    expect(response.applicationId).toBe(application.id);
    expect(response.deploymentId).toBe(deployment.deploymentId);
    expect(response.name).toBeTypeOf('string');
    expect(response.flavor).toBe('XS');
    expect(response.index).toBe(0);
    expect(response.state).toBeTypeOf('string');
    expect(response.hypervisorId).toBeTypeOf('string');
    checkDateFormat(response.creationDate);
    checkDateFormat(response.deletionDate);
    expect(response.network.ip).toBeTypeOf('string');
    expect(response.network.port).toBeTypeOf('number');
    expect(response.isBuildVm).toBe(false);
  });

  /**
   * @param {string} applicationId
   * @returns {Promise<Array<Instance>>}
   */
  function waitForInstances(applicationId) {
    return new Polling(
      async () => {
        const result = await support.client.send(new ListApplicationInstanceCommand({ applicationId }));
        if (result != null && result.length > 0 && result[0].network != null) {
          return { stop: true, value: result };
        }
        return { stop: false };
      },
      1000,
      60000,
    ).start();
  }
});
