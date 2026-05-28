/**
 * @import { StreamRequestsCommandInput, RequestLocation } from './stream-requests-command.types.js'
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { CcStream } from '../../../../lib/stream/cc-stream.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiStreamCommand } from '../../lib/cc-api-command.js';

/**
 * Streams live request locations for an owner, optionally restricted to a single application.
 * Each emitted batch aggregates the incoming requests by geographic cell over a short time window.
 *
 * @extends {CcApiStreamCommand<StreamRequestsCommandInput, RequestsStream>}
 * @endpoint [GET] /v4/stats/organisations/:XXX/requests-live
 * @group Metrics
 * @version 4
 */
export class StreamRequestsCommand extends CcApiStreamCommand {
  /** @type {CcApiStreamCommand<StreamRequestsCommandInput, RequestsStream>['toRequestParams']} */
  toRequestParams(params) {
    return {
      url: safeUrl`/v4/stats/organisations/${params.ownerId}/requests-live`,
      queryParams: new QueryParams().set('applicationId', params.applicationId),
    };
  }

  /** @type {CcApiStreamCommand<StreamRequestsCommandInput, RequestsStream>['createStream']} */
  createStream(requestFactory, config) {
    return new RequestsStream(requestFactory, config);
  }

  /** @type {CcApiStreamCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}

/**
 * SSE stream of live request locations aggregated by geographic cell.
 */
export class RequestsStream extends CcStream {
  /**
   * Registers a callback invoked with each batch of aggregated request locations.
   *
   * @param {(locations: Array<RequestLocation>) => void} callback The function which handles a batch of request locations
   * @returns {this}
   */
  onRequests(callback) {
    return this.on('REQUESTS_LIVE', (event) => {
      /** @type {Array<{ long: number, lat: number, city: string, accessCount: number }>} */
      const payload = JSON.parse(event.data);
      callback(payload.map(({ long, lat, city, accessCount }) => ({ lat, lon: long, city, count: accessCount })));
    });
  }
}
