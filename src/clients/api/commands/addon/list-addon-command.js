/**
 * @import { ListAddonCommandInput, ListAddonCommandOutput } from './list-addon-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddon } from './addon-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListAddonCommandInput, ListAddonCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addons
 * @group Addon
 * @version 2
 */
export class ListAddonCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListAddonCommandInput, ListAddonCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons`);
  }

  /** @type {CcApiSimpleCommand<ListAddonCommandInput, ListAddonCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<ListAddonCommandInput, ListAddonCommandOutput>['getEmptyResponse']} */
  getEmptyResponse() {
    return [];
  }

  /** @type {CcApiSimpleCommand<ListAddonCommandInput, ListAddonCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(transformAddon);
  }
}
