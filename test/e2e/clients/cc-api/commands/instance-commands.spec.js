/**
 * @import { Instance } from '../../../../../src/clients/cc-api/commands/instance/instance.types.js';
 */
import { expect } from 'chai';
import { DeployApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/deploy-application-command.js';
import { GetApplicationInstanceCommand } from '../../../../../src/clients/cc-api/commands/instance/get-application-instance-command.js';
import { ListApplicationInstanceCommand } from '../../../../../src/clients/cc-api/commands/instance/list-application-instance-command.js';
import { Polling } from '../../../../../src/utils/polling.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('instance commands', function () {
  this.timeout(60000);

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

  it('should list application instances', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    const response = await waitForInstances(application.id);

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('string');
    expect(response[0].ownerId).to.equal(support.organisationId);
    expect(response[0].applicationId).to.equal(application.id);
    expect(response[0].deploymentId).to.equal(deployment.deploymentId);
    expect(response[0].name).to.be.a('string');
    expect(response[0].flavor).to.equal('XS');
    expect(response[0].index).to.equal(0);
    expect(response[0].state).to.be.a('string');
    expect(response[0].hypervisorId).to.be.a('string');
    checkDateFormat(response[0].creationDate);
    checkDateFormat(response[0].deletionDate);
    expect(response[0].network.ip).to.be.a('string');
    expect(response[0].network.port).to.be.a('number');
    expect(response[0].isBuildVm).to.equal(false);
  });

  it('should get application instance', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    const instances = await waitForInstances(application.id);

    const response = await support.client.send(
      new GetApplicationInstanceCommand({ applicationId: application.id, instanceId: instances[0].id }),
    );

    expect(response.id).to.be.a('string');
    expect(response.ownerId).to.equal(support.organisationId);
    expect(response.applicationId).to.equal(application.id);
    expect(response.deploymentId).to.equal(deployment.deploymentId);
    expect(response.name).to.be.a('string');
    expect(response.flavor).to.equal('XS');
    expect(response.index).to.equal(0);
    expect(response.state).to.be.a('string');
    expect(response.hypervisorId).to.be.a('string');
    checkDateFormat(response.creationDate);
    checkDateFormat(response.deletionDate);
    expect(response.network.ip).to.be.a('string');
    expect(response.network.port).to.be.a('number');
    expect(response.isBuildVm).to.equal(false);
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
