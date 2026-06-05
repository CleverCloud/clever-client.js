import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { DeleteNetworkGroupExternalPeerCommandInput } from './delete-network-group-external-peer-command.types.js';
import { waitForNetworkGroupPeerDeletion } from './network-group-utils.js';

/**
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
}

/**
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
}
