import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { transformAddonProviderFull } from '../addon-provider/addon-provider-transform.js';
import { GetProductAddonVersionsCommand } from './get-product-addon-versions-command.js';
import type {
  ListProductAddonCommandInput,
  ListProductAddonCommandOutput,
} from './list-product-addon-command.types.js';

/**
 * @endpoint [GET] /v2/products/addonproviders
 * @endpoint [GET] /v4/addon-providers/:XXX
 * @group Product
 * @version 2
 */
export class ListProductAddonCommand extends CcApiCompositeCommand<
  ListProductAddonCommandInput,
  ListProductAddonCommandOutput
> {
  async compose(params: ListProductAddonCommandInput, composer: CcApiComposer): Promise<ListProductAddonCommandOutput> {
    const addons = await composer.send(new ListProductAddonInnerCommand(params));

    if (!params.withVersions) {
      return addons;
    }

    return Promise.all(
      addons.map(async (addon) => {
        const versions = await composer.send(new GetProductAddonVersionsCommand(addon));
        return { ...addon, versions };
      }),
    );
  }
}

/**
 * @endpoint [GET] /v2/products/addonproviders
 * @group Product
 * @version 2
 */
class ListProductAddonInnerCommand extends CcApiSimpleCommand<
  ListProductAddonCommandInput,
  ListProductAddonCommandOutput
> {
  toRequestParams(params: ListProductAddonCommandInput) {
    return get(`/v2/products/addonproviders`, new QueryParams().append('orgaId', params.ownerId));
  }

  transformCommandOutput(response: unknown): ListProductAddonCommandOutput {
    return sortBy((response as Array<unknown>).map(transformAddonProviderFull), 'name');
  }
}
