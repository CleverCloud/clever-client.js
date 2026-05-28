/**
 * @import { GetWarpTokenCommandInput, GetWarpTokenCommandOutput } from './get-warp-token-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetWarpTokenCommandInput, GetWarpTokenCommandOutput>}
 * @endpoint [POST] /v4/stats/organisations/{ownerId}/tokens/read
 * @endpoint [POST] /v4/stats/organisations/{ownerId}/resources/{resourceId}/tokens/read
 * @group WarpToken
 * @version 4
 */
export class GetWarpTokenCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetWarpTokenCommandInput, GetWarpTokenCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const url =
      'applicationId' in params && params.applicationId != null && params.applicationId !== ''
        ? safeUrl`/v4/stats/organisations/${params.ownerId}/resources/${params.applicationId}/tokens/read`
        : safeUrl`/v4/stats/organisations/${params.ownerId}/tokens/read`;

    const body = {};
    if (params.applications != null && params.applications.length > 0) {
      body.applications = params.applications;
    }
    if (params.ttl != null) {
      body.ttl = params.ttl;
    }

    return post(url, body);
  }

  /** @type {CcApiSimpleCommand<GetWarpTokenCommandInput, GetWarpTokenCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      token: response.token,
      expiresAt: normalizeDate(response.expiresAt),
      createdAt: normalizeDate(response.createdAt),
      scope: response.scope,
      applications: response.applications,
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
