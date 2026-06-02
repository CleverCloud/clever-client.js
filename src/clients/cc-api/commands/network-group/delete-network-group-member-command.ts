import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { DeleteNetworkGroupMemberCommandInput } from './delete-network-group-member-command.types.js';
import { waitForNetworkGroupMemberDeletion } from './network-group-utils.js';

/**
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class DeleteNetworkGroupMemberCommand extends CcApiCompositeCommand<DeleteNetworkGroupMemberCommandInput, void> {
  async compose(params: DeleteNetworkGroupMemberCommandInput, composer: CcApiComposer): Promise<void> {
    await composer.send(new DeleteNetworkGroupMemberCommandInner(params));
    await waitForNetworkGroupMemberDeletion(composer, params.ownerId, params.networkGroupId, params.memberId);
    return null;
  }
}

/**
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @group NetworkGroup
 * @version 4
 */
class DeleteNetworkGroupMemberCommandInner extends CcApiSimpleCommand<DeleteNetworkGroupMemberCommandInput, void> {
  toRequestParams(params: DeleteNetworkGroupMemberCommandInput) {
    return delete_(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/members/${params.memberId}`,
    );
  }
}
