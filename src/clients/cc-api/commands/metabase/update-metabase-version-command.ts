import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformMetabaseInfo } from './metabase-transform.js';
import type {
  UpdateMetabaseVersionCommandInput,
  UpdateMetabaseVersionCommandOutput,
} from './update-metabase-version-command.types.js';

/**
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
}
