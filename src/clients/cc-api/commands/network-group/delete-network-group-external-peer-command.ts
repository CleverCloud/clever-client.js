import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { CcApiComposer } from '../../types/cc-api.types.ts';
import type { DeleteNetworkGroupExternalPeerCommandInput } from './delete-network-group-external-peer-command.types.ts';
import { waitForNetworkGroupPeerDeletion } from './network-group-utils.ts';

/**
 * Detaches an external peer from a network group.
 *
 * Deletion is asynchronous: the command polls the peer until it is gone.
 *
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers/:XXX
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/peers/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class DeleteNetworkGroupExternalPeerCommand extends CcApiCompositeCommand<
  DeleteNetworkGroupExternalPeerCommandInput,
  undefined
> {
  async compose(params: DeleteNetworkGroupExternalPeerCommandInput, composer: CcApiComposer): Promise<undefined> {
    await composer.send(new DeleteNetworkGroupExternalPeerCommandInner(params));
    await waitForNetworkGroupPeerDeletion(composer, params.ownerId, params.networkGroupId, params.externalPeerId);
    return undefined;
  }

  // the deletion removes nothing more the second time and the wait only reads
  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Sends the external peer deletion request.
 *
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers/:XXX
 * @group NetworkGroup
 * @version 4
 */
class DeleteNetworkGroupExternalPeerCommandInner extends CcApiSimpleCommand<
  DeleteNetworkGroupExternalPeerCommandInput,
  undefined
> {
  toRequestParams(params: DeleteNetworkGroupExternalPeerCommandInput) {
    return delete_(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/external-peers/${params.externalPeerId}`,
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
