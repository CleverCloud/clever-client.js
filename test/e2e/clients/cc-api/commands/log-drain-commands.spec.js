import { expect } from 'chai';
import { CreateLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/create-log-drain-command.js';
import { DeleteLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/delete-log-drain-command.js';
import { DisableLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/disable-log-drain-command.js';
import { EnableLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/enable-log-drain-command.js';
import { GetLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/get-log-drain-command.js';
import { ListLogDrainCommand } from '../../../../../src/clients/cc-api/commands/log-drain/list-log-drain-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('log-drain commands', function () {
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
        kind: 'LOG',
        target: {
          type: 'RAW_HTTP',
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
    checkDateFormat(response.updatedAt);
    expect(response.status).to.equal('ENABLED');
    expect(response.target.type).to.equal('RAW_HTTP');
    expect(response.target.url).to.equal('https://example.com');
    if (response.target.type === 'RAW_HTTP' || response.target.type === 'ELASTICSEARCH') {
      expect(response.target.credentials).to.be.an('object');
      expect(response.target.credentials.username).to.equal('username');
      expect(response.target.credentials.password).to.be.a('string'); // API returns masked password
    }
  });

  it('should delete log drain', async () => {
    const application = await support.createTestApplication();
    const drain = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        kind: 'LOG',
        target: {
          type: 'RAW_HTTP',
          url: 'https://example.com',
          credentials: {
            username: 'username',
            password: 'password',
          },
        },
      }),
    );

    await support.client.send(new DeleteLogDrainCommand({ applicationId: application.id, drainId: drain.id }));

    // Verify the drain was deleted by checking it no longer exists
    const drains = await support.client.send(new ListLogDrainCommand({ applicationId: application.id }));
    expect(drains.find((d) => d.id === drain.id)).to.be.undefined;
  });

  it('should get log drain', async () => {
    const application = await support.createTestApplication();
    const drain = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        kind: 'LOG',
        target: {
          type: 'RAW_HTTP',
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
    checkDateFormat(response.updatedAt);
    expect(response.status).to.equal('ENABLED');
    expect(response.target.type).to.equal('RAW_HTTP');
    expect(response.target.url).to.equal('https://example.com');
    if (response.target.type === 'RAW_HTTP' || response.target.type === 'ELASTICSEARCH') {
      expect(response.target.credentials).to.be.an('object');
      expect(response.target.credentials.username).to.equal('username');
      expect(response.target.credentials.password).to.be.a('string'); // API returns masked password
    }
  });

  it('should list log drain', async () => {
    const application = await support.createTestApplication();
    const drain1 = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        kind: 'LOG',
        target: {
          type: 'RAW_HTTP',
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
        kind: 'LOG',
        target: {
          type: 'SYSLOG_UDP',
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
        kind: 'LOG',
        target: {
          type: 'RAW_HTTP',
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

    expect(response.id).to.be.a('string');
    expect(response.applicationId).to.equal(application.id);
    checkDateFormat(response.updatedAt);
    expect(response.status).to.equal('DISABLED');
    expect(response.target).to.be.an('object');
  });

  it('should enable log drain', async () => {
    const application = await support.createTestApplication();
    const drain = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        kind: 'LOG',
        target: {
          type: 'RAW_HTTP',
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
    checkDateFormat(response.updatedAt);
    expect(response.status).to.equal('ENABLED');
    expect(response.target.type).to.equal('RAW_HTTP');
    expect(response.target.url).to.equal('https://example.com');
    if (response.target.type === 'RAW_HTTP' || response.target.type === 'ELASTICSEARCH') {
      expect(response.target.credentials).to.be.an('object');
      expect(response.target.credentials.username).to.equal('username');
      expect(response.target.credentials.password).to.be.a('string'); // API returns masked password
    }
  });

  it('should create log drain with ACCESSLOG kind', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        kind: 'ACCESSLOG',
        target: {
          type: 'RAW_HTTP',
          url: 'https://example.com',
        },
      }),
    );

    expect(response.id).to.be.a('string');
    expect(response.applicationId).to.equal(application.id);
    expect(response.status).to.equal('ENABLED');
    expect(response.target).to.deep.equal({
      type: 'RAW_HTTP',
      url: 'https://example.com',
    });
  });

  it('should create log drain with AUDITLOG kind', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(
      new CreateLogDrainCommand({
        applicationId: application.id,
        kind: 'AUDITLOG',
        target: {
          type: 'RAW_HTTP',
          url: 'https://example.com',
        },
      }),
    );

    expect(response.id).to.be.a('string');
    expect(response.applicationId).to.equal(application.id);
    expect(response.status).to.equal('ENABLED');
  });
});
