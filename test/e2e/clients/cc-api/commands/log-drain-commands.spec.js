import { expect } from 'chai';
import { CreateLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/create-log-drain-command.js';
import { DeleteLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/delete-log-drain-command.js';
import { DisableLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/disable-log-drain-command.js';
import { EnableLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/enable-log-drain-command.js';
import { GetLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/get-log-drain-command.js';
import { ListLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/list-log-drain-command.js';
import { ResetLogDrainCursorCommand } from '../../../../../src/clients/cc-api/commands/log-drain/reset-log-drain-cursor-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

describe.skip('log-drain commands', function () {
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

  it('should create log drain', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        target: {
          type: 'HTTP',
          url: 'https://example.com',
          credentials: {
            username: 'username',
            password: 'password',
          },
        },
      }),
    );

    expect(response.id).to.be.a('string');
    expect(response.applicationId).to.equal(application.id);
    checkDateFormat(response.createdAt);
    checkDateFormat(response.lastEdit);
    expect(response.state).to.equal('ENABLED');
    expect(response.token).to.be.a('string');
    expect(response.target).to.deep.equal({
      type: 'HTTP',
      url: 'https://example.com',
      credentials: {
        username: 'username',
        password: 'password',
      },
    });
  });

  it('should delete log drain', async () => {
    const application = await support.createTestApplication();
    const drain = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        target: {
          type: 'HTTP',
          url: 'https://example.com',
          credentials: {
            username: 'username',
            password: 'password',
          },
        },
      }),
    );

    const response = await support.client.send(
      new DeleteLogDrainCommand({ applicationId: application.id, drainId: drain.id }),
    );

    expect(response).to.be.null;
  });

  it('should get log drain', async () => {
    const application = await support.createTestApplication();
    const drain = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        target: {
          type: 'HTTP',
          url: 'https://example.com',
          credentials: {
            username: 'username',
            password: 'password',
          },
        },
      }),
    );

    const response = await support.client.send(
      new GetLogDrainCommand({ applicationId: application.id, drainId: drain.id }),
    );

    expect(response.id).to.be.a('string');
    expect(response.applicationId).to.equal(application.id);
    checkDateFormat(response.createdAt);
    checkDateFormat(response.lastEdit);
    expect(response.state).to.equal('ENABLED');
    expect(response.token).to.be.a('string');
    expect(response.target).to.deep.equal({
      type: 'HTTP',
      url: 'https://example.com',
      credentials: {
        username: 'username',
        password: 'password',
      },
    });
  });

  it('should list log drain', async () => {
    const application = await support.createTestApplication();
    const drain1 = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        target: {
          type: 'HTTP',
          url: 'https://example.com',
          credentials: {
            username: 'username',
            password: 'password',
          },
        },
      }),
    );
    const drain2 = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        target: {
          type: 'UDPSyslog',
          url: 'https://example.com',
        },
      }),
    );

    const response = await support.client.send(new ListLogDrainCommand({ applicationId: application.id }));

    expect(response).to.be.an('array');
    expect(response).to.have.lengthOf(2);
    expect(response.map((r) => r.id)).to.deep.equalInAnyOrder([drain1.id, drain2.id]);
  });

  it('should disable log drain', async () => {
    const application = await support.createTestApplication();
    const drain = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        target: {
          type: 'HTTP',
          url: 'https://example.com',
          credentials: {
            username: 'username',
            password: 'password',
          },
        },
      }),
    );

    const response = await support.client.send(
      new DisableLogDrainCommand({ applicationId: application.id, drainId: drain.id }),
    );

    expect(response).to.be.null;
  });

  it('should enable log drain', async () => {
    const application = await support.createTestApplication();
    const drain = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        target: {
          type: 'HTTP',
          url: 'https://example.com',
          credentials: {
            username: 'username',
            password: 'password',
          },
        },
      }),
    );

    // First disable it
    await support.client.send(new DisableLogDrainCommand({ applicationId: application.id, drainId: drain.id }));

    // Then enable it
    const response = await support.client.send(
      new EnableLogDrainCommand({ applicationId: application.id, drainId: drain.id }),
    );

    expect(response.id).to.be.a('string');
    expect(response.applicationId).to.equal(application.id);
    checkDateFormat(response.createdAt);
    checkDateFormat(response.lastEdit);
    expect(response.state).to.equal('ENABLED');
    expect(response.token).to.be.a('string');
    expect(response.target).to.deep.equal({
      type: 'HTTP',
      url: 'https://example.com',
      credentials: {
        username: 'username',
        password: 'password',
      },
    });
  });

  it('should reset log drain cursor', async () => {
    const application = await support.createTestApplication();
    const drain = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        target: {
          type: 'HTTP',
          url: 'https://example.com',
          credentials: {
            username: 'username',
            password: 'password',
          },
        },
      }),
    );

    const response = await support.client.send(
      new ResetLogDrainCursorCommand({ applicationId: application.id, drainId: drain.id }),
    );

    expect(response).to.be.null;
  });
});
