import { postJson } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformMetabaseInfo } from './metabase-transform.ts';
import type {
  UpdateMetabaseVersionCommandInput,
  UpdateMetabaseVersionCommandOutput,
} from './update-metabase-version-command.types.ts';

/**
 * Moves an add-on to another Metabase version.
 *
 * The instance is rebuilt on the target version, so it is unavailable for the duration.
 *
 * @endpoint [POST] /v4/addon-providers/addon-metabase/addons/:XXX/version/update
 * @group Metabase
 * @version 4
 */
export class UpdateMetabaseVersionCommand extends CcApiSimpleCommand<
  UpdateMetabaseVersionCommandInput,
  UpdateMetabaseVersionCommandOutput
> {
  toRequestParams(params: UpdateMetabaseVersionCommandInput) {
    return postJson(safeUrl`/v4/addon-providers/addon-metabase/addons/${params.addonId}/version/update`, {
      targetVersion: params.targetVersion,
    });
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): UpdateMetabaseVersionCommandOutput {
    return transformMetabaseInfo(response);
  }

  // setting the version env var converges, but every call also redeploys the instance
  isIdempotent(): boolean {
    return false;
  }
}
