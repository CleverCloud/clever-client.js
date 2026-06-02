import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetMetabaseInfoCommandInput, GetMetabaseInfoCommandOutput } from './get-metabase-info-command.types.js';
import { transformMetabaseInfo } from './metabase-transform.js';

/**
 * @endpoint [GET] /v4/addon-providers/addon-metabase/addons/:XXX
 * @group Metabase
 * @version 4
 */
export class GetMetabaseInfoCommand extends CcApiSimpleCommand<
  GetMetabaseInfoCommandInput,
  GetMetabaseInfoCommandOutput
> {
  toRequestParams(params: GetMetabaseInfoCommandInput) {
    return get(safeUrl`/v4/addon-providers/addon-metabase/addons/${params.addonId}`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetMetabaseInfoCommandOutput {
    return transformMetabaseInfo(response);
  }
}
