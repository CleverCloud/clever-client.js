/**
 * @import { ListProductAddonCommandInput, ListProductAddonCommandOutput } from './list-product-addon-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListProductAddonCommandInput, ListProductAddonCommandOutput>}
 * @endpoint [GET] /v2/products/addonproviders
 * @group Product
 * @version 2
 */
export class ListProductAddonCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListProductAddonCommandInput, ListProductAddonCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(`/v2/products/addonproviders`);
  }

  /** @type {CcApiSimpleCommand<ListProductAddonCommandInput, ListProductAddonCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
