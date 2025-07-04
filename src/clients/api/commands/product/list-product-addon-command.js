/**
 * @import { ListProductAddonCommandInput, ListProductAddonCommandOutput } from './list-product-addon-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProviderFull } from '../addon-provider/addon-provider-transform.js';
import { GetProductAddonVersionsCommand } from './get-product-addon-versions-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<ListProductAddonCommandInput, ListProductAddonCommandOutput>}
 * @endpoint [GET] /v2/products/addonproviders
 * @group Product
 * @version 2
 */
export class ListProductAddonCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<ListProductAddonCommandInput, ListProductAddonCommandOutput>['compose']} */
  async compose(params, composer) {
    const addons = await composer.send(new ListProductAddonInnerCommand());

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
 * @extends {CcApiSimpleCommand<void, ListProductAddonCommandOutput>}
 * @endpoint [GET] /v2/products/addonproviders
 * @group Product
 * @version 2
 */
class ListProductAddonInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ListProductAddonCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/products/addonproviders`);
  }

  /** @type {CcApiSimpleCommand<void, ListProductAddonCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(transformAddonProviderFull);
  }

  isAuthRequired() {
    return false;
  }
}
