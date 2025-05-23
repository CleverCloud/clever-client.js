/**
 * @import { GetWarpTokenCommandInput, GetWarpTokenCommandOutput } from './get-warp-token-command.types.js';
 */
import { CcApiCompositeCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<GetWarpTokenCommandInput, GetWarpTokenCommandOutput>}
 * @endpoint [GET] /v2/metrics/read/:XXX
 * @group WarpToken
 * @version 2
 */
export class GetWarpTokenCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<GetWarpTokenCommandInput, GetWarpTokenCommandOutput>['compose']} */
  async compose(params, composer) {}
}
