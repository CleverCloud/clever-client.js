import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  CheckMetabaseVersionCommandInput,
  CheckMetabaseVersionCommandOutput,
} from './check-metabase-version-command.types.js';

/**
 * @endpoint [GET] /v4/addon-providers/addon-metabase/addons/:XXX/version/check
 * @group Metabase
 * @version 4
 */
export class CheckMetabaseVersionCommand extends CcApiSimpleCommand<
  CheckMetabaseVersionCommandInput,
  CheckMetabaseVersionCommandOutput
> {
  toRequestParams(params: CheckMetabaseVersionCommandInput) {
    return get(safeUrl`/v4/addon-providers/addon-metabase/addons/${params.addonId}/version/check`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): CheckMetabaseVersionCommandOutput {
    const res = response as CheckMetabaseVersionCommandOutput;
    return {
      installed: res.installed,
      available: res.available,
      needUpdate: res.needUpdate,
      latest: res.latest,
    };
  }
}
