import { afterEach, describe, expect, it } from 'vitest';
import { GetHeatMapCommand } from '../../../../../src/clients/cc-api/commands/metrics/get-heat-map-command.js';
import { GetMetricsCommand } from '../../../../../src/clients/cc-api/commands/metrics/get-metrics-command.js';
import { GetStatusCodeDistributionCommand } from '../../../../../src/clients/cc-api/commands/metrics/get-status-code-distribution-command.js';
import { StreamRequestsCommand } from '../../../../../src/clients/cc-api/commands/metrics/stream-requests-command.js';
import type { RequestLocation } from '../../../../../src/clients/cc-api/commands/metrics/stream-requests-command.types.js';
import type { CcStream } from '../../../../../src/lib/stream/cc-stream.js';
import { Deferred } from '../../../../../src/lib/utils.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport, STATIC_LOGS_APPLICATION, STATIC_MYSQL_ADDON_ID } from '../e2e-support.js';

describe('metrics commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  it('should get addon memory metrics', async () => {
    const response = await support.client.send(
      new GetMetricsCommand({ addonId: STATIC_MYSQL_ADDON_ID, metrics: ['mem'] }),
    );

    expect(response.mem).toBeInstanceOf(Array);
    expect(response.mem[0].timestamp).toBeTypeOf('number');
    expect(response.mem[0].value).toBeTypeOf('number');
  });

  it('should get addon metrics', async () => {
    const response = await support.client.send(new GetMetricsCommand({ addonId: STATIC_MYSQL_ADDON_ID }));

    expect(response.cpu).toBeInstanceOf(Array);
    expect(response.cpu[0].timestamp).toBeTypeOf('number');
    expect(response.cpu[0].value).toBeTypeOf('number');
    expect(response.mem).toBeInstanceOf(Array);
    expect(response.mem[0].timestamp).toBeTypeOf('number');
    expect(response.mem[0].value).toBeTypeOf('number');
    expect(response.load1).toBeInstanceOf(Array);
    expect(response.load1[0].timestamp).toBeTypeOf('number');
    expect(response.load1[0].value).toBeTypeOf('number');
  });

  it('should get application status code distribution', async () => {
    const response = await support.client.send(
      new GetStatusCodeDistributionCommand({ applicationId: STATIC_LOGS_APPLICATION }),
    );

    expect(response.byDate).to.be.an('array');
    response.byDate.forEach((entry) => {
      checkDateFormat(entry.date);
      expect(entry.total).to.be.a('number');
      expect(entry.statuses).to.be.an('object');
      Object.entries(entry.statuses).forEach(([code, count]) => {
        expect(Number(code)).to.be.a('number');
        expect(count).to.be.a('number');
      });
    });

    expect(response.byStatusCode.total).to.be.a('number');
    expect(response.byStatusCode.statuses).to.be.an('object');
    Object.entries(response.byStatusCode.statuses).forEach(([code, count]) => {
      expect(Number(code)).to.be.a('number');
      expect(count).to.be.a('number');
    });
  });

  it('should get application requests heat map', async () => {
    const response = await support.client.send(new GetHeatMapCommand({ applicationId: STATIC_LOGS_APPLICATION }));

    expect(response).to.be.an('array');
    response.forEach((point) => {
      expect(point.lat).to.be.a('number');
      expect(point.lon).to.be.a('number');
      expect(point.count).to.be.a('number');
    });
  });

  describe('requests live stream', function () {
    let currentStream: CcStream = null;

    afterEach(async () => {
      currentStream?.close();
    });

    it('should stream live request locations', async () => {
      const deferred: Deferred<Array<RequestLocation>> = new Deferred();

      currentStream = (
        await support.client.stream(new StreamRequestsCommand({ applicationId: STATIC_LOGS_APPLICATION }))
      )
        .onOpen(() => {
          // this API call will trigger a request that gets aggregated into a live location
          void fetch(`https://${STATIC_LOGS_APPLICATION.replaceAll('_', '-')}.cleverapps.io`, { method: 'GET' });
        })
        .onRequests((locations) => {
          if (locations.length > 0) {
            deferred.resolve(locations);
          }
        })
        .onError(deferred.reject);

      void currentStream.start();
      const locations = await deferred.promise;

      expect(locations).to.be.an('array');
      locations.forEach((location) => {
        expect(location.lat).to.be.a('number');
        expect(location.lon).to.be.a('number');
        expect(location.city).to.be.a('string');
        expect(location.count).to.be.a('number');
      });
    });
  });
});
