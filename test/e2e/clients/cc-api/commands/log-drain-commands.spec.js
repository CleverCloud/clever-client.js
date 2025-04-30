import { expect } from 'chai';
import { CreateLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/create-log-drain-command.js';
import { DeleteLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/delete-log-drain-command.js';
import { GetLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/get-log-drain-command.js';
import { ListLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/list-log-drain-command.js';
import { UpdateLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/update-log-drain-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('log-drain commands', function () {
  // this.timeout(100000);

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

  it('should update log drain', async () => {
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
      new UpdateLogDrainCommand({ applicationId: application.id, drainId: drain.id, state: 'DISABLED' }),
    );

    expect(response.id).to.be.a('string');
    expect(response.applicationId).to.equal(application.id);
    checkDateFormat(response.createdAt);
    checkDateFormat(response.lastEdit);
    expect(response.state).to.equal('DISABLED');
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
});
