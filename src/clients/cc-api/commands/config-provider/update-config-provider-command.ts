import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  UpdateConfigProviderCommandInput,
  UpdateConfigProviderCommandOutput,
} from './update-config-provider-command.types.js';

/**
 * @endpoint [PUT] /v4/addon-providers/config-provider/addons/:XXX/env
 * @group ConfigProvider
 * @version 4
 */
export class UpdateConfigProviderCommand extends CcApiSimpleCommand<
  UpdateConfigProviderCommandInput,
  UpdateConfigProviderCommandOutput
> {
  toRequestParams(params: UpdateConfigProviderCommandInput) {
    return put(safeUrl`/v4/addon-providers/config-provider/addons/${params.addonId}/env`, params.environment);
  }

  transformCommandOutput(response: unknown): UpdateConfigProviderCommandOutput {
    return sortBy(response as UpdateConfigProviderCommandOutput, 'name');
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }
}
