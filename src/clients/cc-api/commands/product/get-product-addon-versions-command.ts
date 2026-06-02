import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetProductAddonVersionsCommandInput,
  GetProductAddonVersionsCommandOutput,
} from './get-product-addon-versions-command.types.js';
import { transformProductAddonVersions } from './product-transform.js';

/**
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

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
