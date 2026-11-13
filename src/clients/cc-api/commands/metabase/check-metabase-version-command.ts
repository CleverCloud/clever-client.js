import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  CheckMetabaseVersionCommandInput,
  CheckMetabaseVersionCommandOutput,
} from './check-metabase-version-command.types.ts';
import { transformMetabaseVersionCheck } from './metabase-transform.ts';

/**
 * Checks which Metabase versions an add-on can be moved to, and whether it is behind.
 *
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
    return transformMetabaseVersionCheck(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
