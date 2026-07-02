import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
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

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
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

    expect(response.id).toBeTypeOf('string');
    expect(response.applicationId).toBe(application.id);
    checkDateFormat(response.updatedAt);
    expect(response.status).toBe('ENABLED');
    expect(response.target.type).toBe('RAW_HTTP');
    expect(response.target.url).toBe('https://example.com');
    if (response.target.type === 'RAW_HTTP') {
      expect(response.target.credentials).toBeTypeOf('object');
      expect(response.target.credentials!.username).toBe('username');
      expect(response.target.credentials!.password).toBeTypeOf('string'); // API returns masked password
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
    expect(drains.find((d) => d.id === drain.id)).toBeUndefined();
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

    expect(response.id).toBeTypeOf('string');
    expect(response.applicationId).toBe(application.id);
    checkDateFormat(response.updatedAt);
    expect(response.status).toBe('ENABLED');
    expect(response.target.type).toBe('RAW_HTTP');
    expect(response.target.url).toBe('https://example.com');
    if (response.target.type === 'RAW_HTTP') {
      expect(response.target.credentials).toBeTypeOf('object');
      expect(response.target.credentials!.username).toBe('username');
      expect(response.target.credentials!.password).toBeTypeOf('string'); // API returns masked password
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

    expect(response).toBeInstanceOf(Array);
    expect(response).toHaveLength(2);
    expect(response.map((r) => r.id)).toEqualInAnyOrder([drain1.id, drain2.id]);
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

    expect(response.id).toBeTypeOf('string');
    expect(response.applicationId).toBe(application.id);
    checkDateFormat(response.updatedAt);
    expect(response.status).toBe('DISABLED');
    expect(response.target).toBeTypeOf('object');
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

    expect(response.id).toBeTypeOf('string');
    expect(response.applicationId).toBe(application.id);
    checkDateFormat(response.updatedAt);
    expect(response.status).toBe('ENABLED');
    expect(response.target.type).toBe('RAW_HTTP');
    expect(response.target.url).toBe('https://example.com');
    if (response.target.type === 'RAW_HTTP') {
      expect(response.target.credentials).toBeTypeOf('object');
      expect(response.target.credentials!.username).toBe('username');
      expect(response.target.credentials!.password).toBeTypeOf('string'); // API returns masked password
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

    expect(response.id).toBeTypeOf('string');
    expect(response.applicationId).toBe(application.id);
    expect(response.status).toBe('ENABLED');
    expect(response.target).toEqual({
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

    expect(response.id).toBeTypeOf('string');
    expect(response.applicationId).toBe(application.id);
    expect(response.status).toBe('ENABLED');
  });
});
