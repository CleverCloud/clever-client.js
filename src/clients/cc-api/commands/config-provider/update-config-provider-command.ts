import { put } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  UpdateConfigProviderCommandInput,
  UpdateConfigProviderCommandOutput,
} from './update-config-provider-command.types.ts';

/**
 * Replaces the configuration a Config Provider add-on hands to the applications linked to it.
 *
 * Variables left out of the input are removed. Linked applications only see the change on their next
 * deployment.
 *
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

  // one `UPDATE` replacing the whole configuration, so a replay stores the same variables
  isIdempotent(): boolean {
    return true;
  }
}
