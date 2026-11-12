import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { CcApiComposer } from '../../types/cc-api.types.ts';
import type { DeleteNetworkGroupMemberCommandInput } from './delete-network-group-member-command.types.ts';
import { waitForNetworkGroupMemberDeletion } from './network-group-utils.ts';

/**
 * Removes a member from a network group.
 *
 * Deletion is asynchronous: the command polls the member until it is gone.
 *
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class DeleteNetworkGroupMemberCommand extends CcApiCompositeCommand<
  DeleteNetworkGroupMemberCommandInput,
  undefined
> {
  async compose(params: DeleteNetworkGroupMemberCommandInput, composer: CcApiComposer): Promise<undefined> {
    await composer.send(new DeleteNetworkGroupMemberCommandInner(params));
    await waitForNetworkGroupMemberDeletion(composer, params.ownerId, params.networkGroupId, params.memberId);
    return undefined;
  }

  // the deletion removes nothing more the second time and the wait only reads
  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Sends the member deletion request.
 *
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @group NetworkGroup
 * @version 4
 */
class DeleteNetworkGroupMemberCommandInner extends CcApiSimpleCommand<DeleteNetworkGroupMemberCommandInput, undefined> {
  toRequestParams(params: DeleteNetworkGroupMemberCommandInput) {
    return delete_(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/members/${params.memberId}`,
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
