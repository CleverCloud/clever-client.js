/**
 * @import { ListNetworkGroupMemberCommandInput, ListNetworkGroupMemberCommandOutput } from './list-network-group-member-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListNetworkGroupMemberCommandInput, ListNetworkGroupMemberCommandOutput>}
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members
 * @group NetworkGroup
 * @version 4
 */
export class ListNetworkGroupMemberCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListNetworkGroupMemberCommandInput, ListNetworkGroupMemberCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members`, {});
  }
}
