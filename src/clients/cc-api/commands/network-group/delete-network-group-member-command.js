/**
 * @import { DeleteNetworkGroupMemberCommandInput } from './delete-network-group-member-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { waitForNetworkGroupMemberDeletion } from './network-group-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<DeleteNetworkGroupMemberCommandInput, void>}
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class DeleteNetworkGroupMemberCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<DeleteNetworkGroupMemberCommandInput, void>['compose']} */
  async compose(params, composer) {
    await composer.send(new DeleteNetworkGroupMemberCommandInner(params));
    await waitForNetworkGroupMemberDeletion(composer, params.ownerId, params.networkGroupId, params.memberId);
    return null;
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<DeleteNetworkGroupMemberCommandInput, void>}
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @group NetworkGroup
 * @version 4
 */
class DeleteNetworkGroupMemberCommandInner extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteNetworkGroupMemberCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/members/${params.memberId}`,
    );
  }
}
