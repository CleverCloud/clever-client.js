import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { CcApiComposer } from '../../types/cc-api.types.ts';
import type { DeleteNetworkGroupCommandInput } from './delete-network-group-command.types.ts';
import { waitForNetworkGroupDeletion } from './network-group-utils.ts';

/**
 * Deletes a network group, together with all its members and peers.
 *
 * Deletion is asynchronous: the command polls the network group until it is gone.
 *
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class DeleteNetworkGroupCommand extends CcApiCompositeCommand<DeleteNetworkGroupCommandInput, undefined> {
  async compose(params: DeleteNetworkGroupCommandInput, composer: CcApiComposer): Promise<undefined> {
    await composer.send(new DeleteNetworkGroupCommandInner(params));
    await waitForNetworkGroupDeletion(composer, params.ownerId, params.networkGroupId);
    return undefined;
  }

  // the deletion removes nothing more the second time and the wait only reads
  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Sends the network group deletion request.
 *
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @group NetworkGroup
 * @version 4
 */
class DeleteNetworkGroupCommandInner extends CcApiSimpleCommand<DeleteNetworkGroupCommandInput, undefined> {
  toRequestParams(params: DeleteNetworkGroupCommandInput) {
    return delete_(safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
