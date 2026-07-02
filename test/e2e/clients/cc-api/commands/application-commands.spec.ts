import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DeleteApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/delete-application-command.js';
import { DeployApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/deploy-application-command.js';
import { GetApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/get-application-command.js';
import { ListApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/list-application-command.js';
import { UndeployApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/undeploy-application-command.js';
import { UpdateApplicationCommand } from '../../../../../src/clients/cc-api/commands/application/update-application-command.js';
import { expectToBeDefined } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('application commands', function () {
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

  it('should create application', async () => {
    const application = await support.createTestApplication();

    expect(application.id).toMatch(/app_.+/);
    expect(application.ownerId).toBe(support.organisationId);
    expect(application.zone).toBe('par');
  });

  it('should deploy application', async () => {
    const application = await support.createTestApplication();

    const deployment = await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    expect(deployment.deploymentId).toMatch(/deployment_.+/);
  });

  it('should undeploy application', async () => {
    const application = await support.createTestApplication();
    await support.client.send(new DeployApplicationCommand({ applicationId: application.id }));

    const response = await support.client.send(new UndeployApplicationCommand({ applicationId: application.id }));

    expect(response).toBeNull();
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

    expect(updatedApplication.buildFlavor.name).toBe('L');
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

    expect(updatedApplication.branch).toBe('test');
  });

  it('should delete application', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(new DeleteApplicationCommand({ applicationId: application.id }));

    expect(response).toBeNull();
  });

  it('should get application', async () => {
    const application = await support.createTestApplication();
    const response = await support.client.send(
      new GetApplicationCommand({ applicationId: application.id, withBranches: true }),
    );

    expect(response).toEqualInAnyOrder(application);
  });

  it('should list applications', async () => {
    const application1 = await support.createTestApplication('app1');
    const application2 = await support.createTestApplication('app2');

    const response = await support.client.send(
      new ListApplicationCommand({ ownerId: support.organisationId, withBranches: true }),
    );

    expect(response).toEqualInAnyOrder([application1, application2]);
  });

  it('should list applications empty', async () => {
    const response = await support.client.send(
      new ListApplicationCommand({ ownerId: support.organisationId, withBranches: false }),
    );

    expect(response).toHaveLength(0);
  });

  it('should create FTP application', async () => {
    const application = await support.createFtpApplication();

    expect(application.id).toMatch(/app_.+/);
    expect(application.ownerId).toBe(support.organisationId);
    expect(application.deployment.type).toBe('FTP');
  });

  it('should get FTP application', async () => {
    const application = await support.createFtpApplication();
    const response = await support.client.send(
      new GetApplicationCommand({ applicationId: application.id, withBranches: false }),
    );

    expectToBeDefined(response);
    expect(response.id).toBe(application.id);
    expect(response.deployment.type).toBe('FTP');
  });

  it('should list FTP application', async () => {
    const application = await support.createFtpApplication();
    const response = await support.client.send(
      new ListApplicationCommand({ ownerId: support.organisationId, withBranches: false }),
    );

    expect(response.map((a) => a.id)).toContain(application.id);
    expect(response.find((a) => a.id === application.id)?.deployment.type).toBe('FTP');
  });
});
