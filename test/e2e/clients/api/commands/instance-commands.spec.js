import { expect } from 'chai';
import { DeployApplicationCommand } from '../../../../../src/clients/api/commands/application/deploy-application-command.js';
import { GetInstanceCommand } from '../../../../../src/clients/api/commands/instance/get-instance-command.js';
import { ListInstanceCommand } from '../../../../../src/clients/api/commands/instance/list-instance-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';
import { sleep } from '../../../../lib/timers.js';

describe('instances commands', function () {
  this.timeout(100000);

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

  it('should list instances', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));
    // may be not enough when infrastructure is slow. todo: introduce a retry mechanism instead of this horrible sleep
    await sleep(20000);

    const response = await support.client.send(new ListInstanceCommand({ applicationId: application.id }));

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('string');
    expect(response[0].ownerId).to.equal(support.organisationId);
    expect(response[0].applicationId).to.equal(application.id);
    expect(response[0].deploymentId).to.equal(deployment.deploymentId);
    expect(response[0].name).to.be.a('string');
    expect(response[0].flavor).to.equal('XS');
    expect(response[0].index).to.equal(0);
    expect(response[0].state).to.equal('STARTING');
    expect(response[0].hypervisorId).to.be.a('string');
    expect(response[0].creationDate).to.equal(new Date(response[0].creationDate).toISOString());
    expect(response[0].deletionDate).to.be.null;
    expect(response[0].network.ip).to.be.a('string');
    expect(response[0].network.port).to.be.a('number');
    expect(response[0].isBuildVm).to.equal(false);
  });

  it('should get instance', async () => {
    const application = await support.createTestApplication();
    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));
    // may be not enough when infrastructure is slow. todo: introduce a retry mechanism instead of this horrible sleep
    await sleep(20000);
    const instances = await support.client.send(new ListInstanceCommand({ applicationId: application.id }));

    const response = await support.client.send(
      new GetInstanceCommand({ applicationId: application.id, instanceId: instances[0].id }),
    );

    expect(response.id).to.be.a('string');
    expect(response.ownerId).to.equal(support.organisationId);
    expect(response.applicationId).to.equal(application.id);
    expect(response.deploymentId).to.equal(deployment.deploymentId);
    expect(response.name).to.be.a('string');
    expect(response.flavor).to.equal('XS');
    expect(response.index).to.equal(0);
    expect(response.state).to.equal('STARTING');
    expect(response.hypervisorId).to.be.a('string');
    expect(response.creationDate).to.equal(new Date(response.creationDate).toISOString());
    expect(response.deletionDate).to.be.undefined;
    expect(response.network.ip).to.be.a('string');
    expect(response.network.port).to.be.a('number');
    expect(response.isBuildVm).to.equal(false);
  });
});
