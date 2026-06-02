import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { ListLogCommand } from '../../../../../src/clients/cc-api/commands/log/list-log-command.js';
import type {
  ApplicationAccessLog,
  ApplicationRuntimeLog,
} from '../../../../../src/clients/cc-api/commands/log/log.types.js';
import { StreamApplicationAccessLogCommand } from '../../../../../src/clients/cc-api/commands/log/stream-application-access-log-command.js';
import { StreamApplicationRuntimeLogCommand } from '../../../../../src/clients/cc-api/commands/log/stream-application-runtime-log-command.js';
import type { CcStream } from '../../../../../src/lib/stream/cc-stream.js';
import { Deferred } from '../../../../../src/lib/utils.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport, STATIC_LOGS_APPLICATION, STATIC_MYSQL_ADDON_ID } from '../e2e-support.js';

describe('log commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  it('should list addon log', async () => {
    const response = await support.client.send(new ListLogCommand({ addonId: STATIC_MYSQL_ADDON_ID }));

    expect(response).toBeInstanceOf(Array);
    expect(response[0].id).toBeTypeOf('string');
    checkDateFormat(response[0].date);
    expect(response[0].message).toBeTypeOf('string');
    expect(response[0].type).toBeTypeOf('string');
    expect(response[0].severity).toBeTypeOf('string');
    expect(response[0].program).toBeTypeOf('string');
    expect(response[0].deploymentId).toBeTypeOf('string');
    expect(response[0].sourceHost).toBeTypeOf('string');
    expect(response[0].sourceIp).toBeTypeOf('string');
    expect(response[0].zone).toBeTypeOf('string');
  });

  it('should list addon log with options', async () => {
    const logs = await support.client.send(new ListLogCommand({ addonId: STATIC_MYSQL_ADDON_ID, limit: 1 }));
    const deploymentId = logs[0].deploymentId;

    const response = await support.client.send(
      new ListLogCommand({
        addonId: STATIC_MYSQL_ADDON_ID,
        deploymentId,
        limit: 10,
        order: 'DESC',
      }),
    );

    expect(response).toBeInstanceOf(Array);
    expect(response[0].id).toBeTypeOf('string');
    checkDateFormat(response[0].date);
    expect(response[0].message).toBeTypeOf('string');
    expect(response[0].type).toBeTypeOf('string');
    expect(response[0].severity).toBeTypeOf('string');
    expect(response[0].program).toBeTypeOf('string');
    expect(response[0].deploymentId).toBeTypeOf('string');
    expect(response[0].sourceHost).toBeTypeOf('string');
    expect(response[0].sourceIp).toBeTypeOf('string');
    expect(response[0].zone).toBeTypeOf('string');
  });

  describe('log stream', function () {
    const support = e2eSupport({ user: 'test-user-without-github' });

    let currentStream: CcStream = null;

    beforeAll(async () => {
      currentStream = null;
      await support.prepare();
    });

    afterAll(async () => {
      await support.cleanup();
    });

    afterEach(async () => {
      currentStream?.close();
    });

    it('should get application runtime logs', async () => {
      const deferred = new Deferred<ApplicationRuntimeLog>();

      currentStream = (
        await support.client.stream(new StreamApplicationRuntimeLogCommand({ applicationId: STATIC_LOGS_APPLICATION }))
      )
        .onOpen(() => {
          // this API call will trigger a log message
          void fetch(`https://${STATIC_LOGS_APPLICATION.replaceAll('_', '-')}.cleverapps.io`, { method: 'HEAD' });
        })
        .onLog(deferred.resolve)
        .onError(deferred.reject);

      void currentStream.start();

      const log = await deferred.promise;

      expect(log.applicationId).toBe(STATIC_LOGS_APPLICATION);
      expect(log.commitId).toBeTypeOf('string');
      checkDateFormat(log.date);
      expect(log.deploymentId).toBeTypeOf('string');
      expect(log.id).toBeTypeOf('string');
      expect(log.instanceId).toBeTypeOf('string');
      expect(log.message).toBe('test log message');
      expect(log.priority).toBeTypeOf('number');
      expect(log.service).toBeTypeOf('string');
      expect(log.severity).toBe('info');
      expect(log.version).toBeTypeOf('string');
      expect(log.zone).toBe('par');
    });

    it('should get application access logs', async function () {
      const deferred = new Deferred<ApplicationAccessLog>();

      currentStream = (
        await support.client.stream(new StreamApplicationAccessLogCommand({ applicationId: STATIC_LOGS_APPLICATION }))
      )
        .onOpen(() => {
          // this API call will trigger an access log
          void fetch(`https://${STATIC_LOGS_APPLICATION.replaceAll('_', '-')}.cleverapps.io`, { method: 'GET' });
        })
        .onLog(deferred.resolve)
        .onError(deferred.reject);

      void currentStream.start();
      const log = await deferred.promise;

      expect(log.applicationId).toBe(STATIC_LOGS_APPLICATION);
      expect(log.bytesIn).toBeTypeOf('number');
      expect(log.bytesOut).toBeTypeOf('number');
      checkDateFormat(log.date);
      expect(log.destination.city).toBeTypeOf('string');
      expect(log.destination.countryCode).toBeTypeOf('string');
      expect(log.destination.geoLocation.latitude).toBeTypeOf('number');
      expect(log.destination.geoLocation.longitude).toBeTypeOf('number');
      expect(log.destination.ip).toBeTypeOf('string');
      expect(log.destination.port).toBeTypeOf('number');
      expect(log.id).toBeTypeOf('string');
      expect(log.instanceId).toBeTypeOf('string');
      expect(log.requestId).toBeTypeOf('string');
      expect(log.source.city).toBeTypeOf('string');
      expect(log.source.countryCode).toBeTypeOf('string');
      expect(log.source.geoLocation.latitude).toBeTypeOf('number');
      expect(log.source.geoLocation.longitude).toBeTypeOf('number');
      expect(log.source.ip).toBeTypeOf('string');
      expect(log.source.port).toBeTypeOf('number');
      expect(log.zone).toBeTypeOf('string');
      expect(log.type).toBeTypeOf('string');
      expect(log.detail.request.host).toBeTypeOf('string');
      expect(log.detail.request.method).toBe('GET');
      expect(log.detail.request.path).toBe('/');
      expect(log.detail.request.scheme).toBeTypeOf('string');
      expect(log.detail.response.statusCode).toBe(200);
      expect(log.detail.response.time).toBeTypeOf('number');
    });
  });
});
