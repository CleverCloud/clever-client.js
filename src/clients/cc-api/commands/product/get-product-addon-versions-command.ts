import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  GetProductAddonVersionsCommandInput,
  GetProductAddonVersionsCommandOutput,
} from './get-product-addon-versions-command.types.ts';
import { transformProductAddonVersions } from './product-transform.ts';

/**
 * Retrieves the versions an add-on provider offers, on its shared clusters and on dedicated
 * instances.
 *
 * @endpoint [GET] /v4/addon-providers/:XXX
 * @group Product
 * @version 4
 */
export class GetProductAddonVersionsCommand extends CcApiSimpleCommand<
  GetProductAddonVersionsCommandInput,
  GetProductAddonVersionsCommandOutput
> {
  toRequestParams(params: GetProductAddonVersionsCommandInput) {
    return get(safeUrl`/v4/addon-providers/${params.id}`);
  }

  transformCommandOutput(response: unknown): GetProductAddonVersionsCommandOutput {
    return transformProductAddonVersions(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
