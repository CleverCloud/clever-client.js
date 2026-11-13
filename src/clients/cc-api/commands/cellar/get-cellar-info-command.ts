import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformCellarInfo } from './cellar-transform.ts';
import type { GetCellarInfoCommandInput, GetCellarInfoCommandOutput } from './get-cellar-info-command.types.ts';

/**
 * Retrieves a Cellar add-on, with how much storage and traffic it is using.
 *
 * @endpoint [GET] /v4/cellar/organisations/:XXX/cellar/:XXX
 * @group Cellar
 * @version 4
 */
export class GetCellarInfoCommand extends CcApiSimpleCommand<GetCellarInfoCommandInput, GetCellarInfoCommandOutput> {
  toRequestParams(params: GetCellarInfoCommandInput) {
    return get(safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}`);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): GetCellarInfoCommandOutput {
    return transformCellarInfo(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
