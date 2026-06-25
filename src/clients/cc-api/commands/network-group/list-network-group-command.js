/**
 * @import { ListNetworkGroupCommandInput, ListNetworkGroupCommandOutput } from './list-network-group-command.types.js';
 * @import { NetworkGroup } from './network-group.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { normalizeMemberKind } from './network-group-utils.js';

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

  /** @type {CcApiSimpleCommand<ListNetworkGroupCommandInput, ListNetworkGroupCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(
      /** @param {NetworkGroup} networkGroup */ (networkGroup) => ({
        ...networkGroup,
        members: networkGroup.members.map(normalizeMemberKind),
      }),
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
