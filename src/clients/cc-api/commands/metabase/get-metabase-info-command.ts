import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { GetMetabaseInfoCommandInput, GetMetabaseInfoCommandOutput } from './get-metabase-info-command.types.ts';
import { transformMetabaseInfo } from './metabase-transform.ts';

/**
 * Retrieves a Metabase add-on, with the URL to reach it and the resources it is built on.
 *
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

  transformCommandOutput(response: unknown): GetMetabaseInfoCommandOutput {
    return transformMetabaseInfo(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
