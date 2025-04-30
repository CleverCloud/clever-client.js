/**
 * @import { ListProductAddonCommandInput, ListProductAddonCommandOutput } from './list-product-addon-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProviderFull } from '../addon-provider/addon-provider-transform.js';
import { GetProductAddonVersionsCommand } from './get-product-addon-versions-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<ListProductAddonCommandInput, ListProductAddonCommandOutput>}
 * @endpoint [GET] /v2/products/addonproviders
 * @endpoint [GET] /v4/addon-providers/:XXX
 * @group Product
 * @version 2
 */
export class ListProductAddonCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<ListProductAddonCommandInput, ListProductAddonCommandOutput>['compose']} */
  async compose(params, composer) {
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
 *
 * @extends {CcApiSimpleCommand<ListProductAddonCommandInput, ListProductAddonCommandOutput>}
 * @endpoint [GET] /v2/products/addonproviders
 * @group Product
 * @version 2
 */
class ListProductAddonInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListProductAddonCommandInput, ListProductAddonCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(`/v2/products/addonproviders`, new QueryParams().append('orgaId', params.ownerId));
  }

  /** @type {CcApiSimpleCommand<ListProductAddonCommandInput, ListProductAddonCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformAddonProviderFull), 'name');
  }
}
