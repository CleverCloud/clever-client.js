import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetWarpTokenCommandInput,
  GetWarpTokenCommandOutput,
  WarpTokenApplication,
} from './get-warp-token-command.types.js';
import { transformWarpToken } from './warp-token-transform.js';

/**
 * @endpoint [POST] /v4/stats/organisations/{ownerId}/tokens/read
 * @endpoint [POST] /v4/stats/organisations/{ownerId}/resources/{resourceId}/tokens/read
 * @group WarpToken
 * @version 4
 */
export class GetWarpTokenCommand extends CcApiSimpleCommand<GetWarpTokenCommandInput, GetWarpTokenCommandOutput> {
  toRequestParams(params: GetWarpTokenCommandInput) {
    const url =
      'applicationId' in params && params.applicationId != null && params.applicationId !== ''
        ? safeUrl`/v4/stats/organisations/${params.ownerId}/resources/${params.applicationId}/tokens/read`
        : safeUrl`/v4/stats/organisations/${params.ownerId}/tokens/read`;

    const body: { applications?: Array<WarpTokenApplication>; ttl?: string } = {};
    if (params.applications != null && params.applications.length > 0) {
      body.applications = params.applications;
    }
    if (params.ttl != null) {
      body.ttl = params.ttl;
    }

    return post(url, body);
  }

  transformCommandOutput(response: unknown): GetWarpTokenCommandOutput {
    return transformWarpToken(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
