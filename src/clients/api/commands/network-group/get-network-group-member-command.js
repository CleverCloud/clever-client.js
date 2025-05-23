/**
 * @import { GetNetworkGroupMemberCommandInput } from './get-network-group-member-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetNetworkGroupMemberCommandInput, void>}
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class GetNetworkGroupMemberCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetNetworkGroupMemberCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX`);
  }
}
