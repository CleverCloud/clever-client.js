/**
 * @import { GetConfigProviderCommandInput, GetConfigProviderCommandOutput } from './get-config-provider-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetConfigProviderCommandInput, GetConfigProviderCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/config-provider/addons/:XXX/env
 * @group ConfigProvider
 * @version 4
 */
export class GetConfigProviderCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetConfigProviderCommandInput, GetConfigProviderCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/config-provider/addons/${params.addonId}/env`);
  }

  /** @type {CcApiSimpleCommand<GetConfigProviderCommandInput, GetConfigProviderCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }
}
