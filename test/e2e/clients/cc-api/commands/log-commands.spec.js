/**
 * @import { ApplicationRuntimeLog, ApplicationAccessLog } from '../../../../../src/clients/cc-api/commands/log/log.types.js';
 * @import { CcStream } from '../../../../../src/lib/stream/cc-stream.js';
 */
import { expect } from 'chai';
import { ListLogCommand } from '../../../../../src/clients/cc-api/commands/log/list-log-command.js';
import { StreamApplicationAccessLogCommand } from '../../../../../src/clients/cc-api/commands/log/stream-application-access-log-command.js';
import { StreamApplicationRuntimeLogCommand } from '../../../../../src/clients/cc-api/commands/log/stream-application-runtime-log-command.js';
import { Deferred } from '../../../../../src/lib/utils.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport, STATIC_LOGS_APPLICATION, STATIC_MYSQL_ADDON_ID } from '../e2e-support.js';

describe('log commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  it('should list addon log', async () => {
    const response = await support.client.send(new ListLogCommand({ addonId: STATIC_MYSQL_ADDON_ID }));

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('string');
    checkDateFormat(response[0].date);
    expect(response[0].message).to.be.a('string');
    expect(response[0].type).to.be.a('string');
    expect(response[0].severity).to.be.a('string');
    expect(response[0].program).to.be.a('string');
    expect(response[0].deploymentId).to.be.a('string');
    expect(response[0].sourceHost).to.be.a('string');
    expect(response[0].sourceIp).to.be.a('string');
    expect(response[0].zone).to.be.a('string');
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

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('string');
    checkDateFormat(response[0].date);
    expect(response[0].message).to.be.a('string');
    expect(response[0].type).to.be.a('string');
    expect(response[0].severity).to.be.a('string');
    expect(response[0].program).to.be.a('string');
    expect(response[0].deploymentId).to.be.a('string');
    expect(response[0].sourceHost).to.be.a('string');
    expect(response[0].sourceIp).to.be.a('string');
    expect(response[0].zone).to.be.a('string');
  });

  describe('log stream', function () {
    const support = e2eSupport({ user: 'test-user-without-github' });

    /** @type {CcStream} */
    let currentStream = null;

    before(async () => {
      currentStream = null;
      await support.prepare();
    });

    after(async () => {
      await support.cleanup();
    });

    afterEach(async () => {
      currentStream?.close();
    });

    it('should get application runtime logs', async () => {
      /** @type {Deferred<ApplicationRuntimeLog>} */
      const deferred = new Deferred();

      currentStream = (
        await support.client.stream(new StreamApplicationRuntimeLogCommand({ applicationId: STATIC_LOGS_APPLICATION }))
      )
        .onOpen(() => {
          // this API call will trigger a log message
          fetch(`https://${STATIC_LOGS_APPLICATION.replaceAll('_', '-')}.cleverapps.io`, { method: 'HEAD' });
        })
        .onLog(deferred.resolve)
        .onError(deferred.reject);

      currentStream.start();

      const log = await deferred.promise;

      expect(log.applicationId).to.equal(STATIC_LOGS_APPLICATION);
      expect(log.commitId).to.be.a('string');
      checkDateFormat(log.date);
      expect(log.deploymentId).to.be.a('string');
      expect(log.id).to.be.a('string');
      expect(log.instanceId).to.be.a('string');
      expect(log.message).to.equal('test log message');
      expect(log.priority).to.be.a('number');
      expect(log.service).to.be.a('string');
      expect(log.severity).to.equal('info');
      expect(log.version).to.be.a('string');
      expect(log.zone).to.equal('par');
    });

    it('should get application access logs', async function () {
      /** @type {Deferred<ApplicationAccessLog>} */
      const deferred = new Deferred();

      currentStream = (
        await support.client.stream(new StreamApplicationAccessLogCommand({ applicationId: STATIC_LOGS_APPLICATION }))
      )
        .onOpen(() => {
          // this API call will trigger an access log
          fetch(`https://${STATIC_LOGS_APPLICATION.replaceAll('_', '-')}.cleverapps.io`, { method: 'GET' });
        })
        .onLog(deferred.resolve)
        .onError(deferred.reject);

      currentStream.start();
      const log = await deferred.promise;

      expect(log.applicationId).to.equal(STATIC_LOGS_APPLICATION);
      expect(log.bytesIn).to.be.a('number');
      expect(log.bytesOut).to.be.a('number');
      checkDateFormat(log.date);
      expect(log.destination.city).to.be.a('string');
      expect(log.destination.countryCode).to.be.a('string');
      expect(log.destination.geoLocation.latitude).to.be.a('number');
      expect(log.destination.geoLocation.longitude).to.be.a('number');
      expect(log.destination.ip).to.be.a('string');
      expect(log.destination.port).to.be.a('number');
      expect(log.id).to.be.a('string');
      expect(log.instanceId).to.be.a('string');
      expect(log.requestId).to.be.a('string');
      expect(log.source.city).to.be.a('string');
      expect(log.source.countryCode).to.be.a('string');
      expect(log.source.geoLocation.latitude).to.be.a('number');
      expect(log.source.geoLocation.longitude).to.be.a('number');
      expect(log.source.ip).to.be.a('string');
      expect(log.source.port).to.be.a('number');
      expect(log.zone).to.be.a('string');
      expect(log.type).to.equal('http');
      expect(log.detail.request.host).to.be.a('string');
      expect(log.detail.request.method).to.equal('GET');
      expect(log.detail.request.path).to.equal('/');
      expect(log.detail.request.scheme).to.equal('https');
      expect(log.detail.response.statusCode).to.equal(200);
      expect(log.detail.response.time).to.be.a('number');
    });
  });
});
