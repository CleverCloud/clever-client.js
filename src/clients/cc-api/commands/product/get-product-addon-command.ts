import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { transformAddonProviderFull } from '../addon-provider/addon-provider-transform.js';
import type { GetProductAddonCommandInput, GetProductAddonCommandOutput } from './get-product-addon-command.types.js';
import { GetProductAddonVersionsCommand } from './get-product-addon-versions-command.js';

/**
 * @endpoint [GET] /v2/products/addonproviders/:XXX
 * @group Product
 * @version 2
 */
export class GetProductAddonCommand extends CcApiCompositeCommand<
  GetProductAddonCommandInput,
  GetProductAddonCommandOutput
> {
  async compose(params: GetProductAddonCommandInput, composer: CcApiComposer): Promise<GetProductAddonCommandOutput> {
    const addon = await composer.send(new GetProductAddonInnerCommand(params));
    if (addon == null) {
      return null;
    }

    if (!params.withVersions) {
      return addon;
    }

    const versions = await composer.send(new GetProductAddonVersionsCommand(params));
    return {
      ...addon,
      versions,
    };
  }
}

/**
 * @endpoint [GET] /v2/products/addonproviders/:XXX
 * @group Product
 * @version 2
 */
class GetProductAddonInnerCommand extends CcApiSimpleCommand<
  GetProductAddonCommandInput,
  GetProductAddonCommandOutput
> {
  toRequestParams(params: GetProductAddonCommandInput) {
    return get(safeUrl`/v2/products/addonproviders/${params.id}`, new QueryParams().append('orgaId', params.ownerId));
  }

  transformCommandOutput(response: unknown): GetProductAddonCommandOutput {
    return transformAddonProviderFull(response);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
