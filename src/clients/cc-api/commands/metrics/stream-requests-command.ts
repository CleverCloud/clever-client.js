import { QueryParams } from '../../../../lib/request/query-params.ts';
import { CcStream } from '../../../../lib/stream/cc-stream.ts';
import type { CcStreamConfig, CcStreamRequestFactory } from '../../../../lib/stream/cc-stream.types.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import type { CcRequestParams } from '../../../../types/request.types.ts';
import { CcApiStreamCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformRequestLocations } from './metrics-transform.ts';
import type { RequestLocation, StreamRequestsCommandInput } from './stream-requests-command.types.ts';

/**
 * Streams live request locations for an owner, optionally restricted to a single application.
 * Each emitted batch aggregates the incoming requests by geographic cell over a five-second window. Requests
 * whose source IP address could not be geolocated are dropped, so a batch can come back empty.
 *
 * @endpoint [GET] /v4/stats/organisations/:XXX/requests-live
 * @group Metrics
 * @version 4
 */
export class StreamRequestsCommand extends CcApiStreamCommand<StreamRequestsCommandInput, RequestsStream> {
  toRequestParams(params: StreamRequestsCommandInput): Partial<CcRequestParams> {
    return {
      url: safeUrl`/v4/stats/organisations/${params.ownerId}/requests-live`,
      queryParams: new QueryParams().set('applicationId', params.applicationId),
    };
  }

  createStream(requestFactory: CcStreamRequestFactory, config: CcStreamConfig): RequestsStream {
    return new RequestsStream(requestFactory, config);
  }

  getIdsToResolve(): IdResolve {
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
   * @param callback The function which handles a batch of request locations
   */
  onRequests(callback: (locations: Array<RequestLocation>) => void): this {
    return this.on('REQUESTS_LIVE', (event) => {
      callback(transformRequestLocations(event.data));
    });
  }
}
