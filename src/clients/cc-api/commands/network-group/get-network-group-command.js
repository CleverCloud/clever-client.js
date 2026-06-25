/**
 * @import { GetNetworkGroupCommandInput, GetNetworkGroupCommandOutput } from './get-network-group-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { normalizeMemberKind } from './network-group-utils.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetNetworkGroupCommandInput, GetNetworkGroupCommandOutput>}
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class GetNetworkGroupCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetNetworkGroupCommandInput, GetNetworkGroupCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}`);
  }

  /** @type {CcApiSimpleCommand<GetNetworkGroupCommandInput, GetNetworkGroupCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      ...response,
      members: response.members.map(normalizeMemberKind),
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
