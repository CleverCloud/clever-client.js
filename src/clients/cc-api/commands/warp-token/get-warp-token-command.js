/**
 * @import { GetWarpTokenCommandInput, GetWarpTokenCommandOutput } from './get-warp-token-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetWarpTokenCommandInput, GetWarpTokenCommandOutput>}
 * @endpoint [GET] /v2/metrics/read/:XXX
 * @endpoint [GET] /v2/w10tokens/accessLogs/read/:XXX
 * @group WarpToken
 * @version 2
 */
export class GetWarpTokenCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetWarpTokenCommandInput, GetWarpTokenCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    if (params.tokenKind === 'METRICS') {
      return get(safeUrl`/v2/metrics/read/${params.ownerId}`);
    }
    return get(safeUrl`/v2/w10tokens/accessLogs/read/${params.ownerId}`);
  }
}
