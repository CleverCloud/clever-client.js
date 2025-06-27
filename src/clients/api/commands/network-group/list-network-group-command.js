/**
 * @import { ListNetworkGroupCommandInput, ListNetworkGroupCommandOutput } from './list-network-group-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListNetworkGroupCommandInput, ListNetworkGroupCommandOutput>}
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups
 * @group NetworkGroup
 * @version 4
 */
export class ListNetworkGroupCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListNetworkGroupCommandInput, ListNetworkGroupCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups`);
  }

  /** @type {CcApiSimpleCommand<ListNetworkGroupCommandInput, ListNetworkGroupCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<ListNetworkGroupCommandInput, ListNetworkGroupCommandOutput>['getEmptyResponse']} */
  getEmptyResponse() {
    return [];
  }
}
