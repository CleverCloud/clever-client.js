/**
 * @import { UpdateConfigProviderCommandInput, UpdateConfigProviderCommandOutput } from './update-config-provider-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateConfigProviderCommandInput, UpdateConfigProviderCommandOutput>}
 * @endpoint [PUT] /v4/addon-providers/config-provider/addons/:XXX/env
 * @group ConfigProvider
 * @version 4
 */
export class UpdateConfigProviderCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateConfigProviderCommandInput, UpdateConfigProviderCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v4/addon-providers/config-provider/addons/${params.addonId}/env`, params.environment);
  }

  /** @type {CcApiSimpleCommand<UpdateConfigProviderCommandInput, UpdateConfigProviderCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response, 'name');
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }
}
