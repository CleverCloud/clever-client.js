/**
 * @import { GetOtoroshiConfigCommandInput, GetOtoroshiConfigCommandOutput } from './get-otoroshi-config-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetOtoroshiConfigCommandInput, GetOtoroshiConfigCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/addon-otoroshi/addons/:XXX/config.yaml
 * @group Otoroshi
 * @version 4
 */
export class GetOtoroshiConfigCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetOtoroshiConfigCommandInput, GetOtoroshiConfigCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return {
      method: 'GET',
      url: safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/config.yaml`,
      headers: new HeadersBuilder().accept('application/yaml').build(),
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<GetOtoroshiConfigCommandInput, GetOtoroshiConfigCommandOutput>['transformCommandOutput']} */
  async transformCommandOutput(response) {
    if (typeof response === 'string') {
      return response;
    }
    return response.text();
  }
}
