/**
 * @import { GetProductAddonCommandInput, GetProductAddonCommandOutput } from './get-product-addon-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProviderFull } from '../addon-provider/addon-provider-transform.js';
import { GetProductAddonVersionsCommand } from './get-product-addon-versions-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<GetProductAddonCommandInput, GetProductAddonCommandOutput>}
 * @endpoint [GET] /v2/products/addonproviders/:XXX
 * @group Product
 * @version 2
 */
export class GetProductAddonCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<GetProductAddonCommandInput, GetProductAddonCommandOutput>['compose']} */
  async compose(params, composer) {
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
 *
 * @extends {CcApiSimpleCommand<GetProductAddonCommandInput, GetProductAddonCommandOutput>}
 * @endpoint [GET] /v2/products/addonproviders/:XXX
 * @group Product
 * @version 2
 */
class GetProductAddonInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetProductAddonCommandInput, GetProductAddonCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/products/addonproviders/${params.id}`, new QueryParams().append('orgaId', params.ownerId));
  }

  /** @type {CcApiSimpleCommand<GetProductAddonCommandInput, GetProductAddonCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformAddonProviderFull(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
