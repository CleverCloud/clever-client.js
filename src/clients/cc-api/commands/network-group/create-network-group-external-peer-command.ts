import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type {
  CreateNetworkGroupExternalPeerCommandInnerOutput,
  CreateNetworkGroupExternalPeerCommandInput,
  CreateNetworkGroupExternalPeerCommandOutput,
} from './create-network-group-external-peer-command.types.js';
import { waitForNetworkGroupPeerCreation } from './network-group-utils.js';
import type { NetworkGroupPeerExternal } from './network-group.types.js';

/**
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/peers/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class CreateNetworkGroupExternalPeerCommand extends CcApiCompositeCommand<
  CreateNetworkGroupExternalPeerCommandInput,
  CreateNetworkGroupExternalPeerCommandOutput
> {
  async compose(
    params: CreateNetworkGroupExternalPeerCommandInput,
    composer: CcApiComposer,
  ): Promise<CreateNetworkGroupExternalPeerCommandOutput> {
    const peer = await composer.send(new CreateNetworkGroupExternalPeerCommandInner({ ...params }));
    return (await waitForNetworkGroupPeerCreation(
      composer,
      params.ownerId,
      params.networkGroupId,
      peer.peerId,
    )) as NetworkGroupPeerExternal;
  }
}

/**
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers
 * @group NetworkGroup
 * @version 4
 */
class CreateNetworkGroupExternalPeerCommandInner extends CcApiSimpleCommand<
  CreateNetworkGroupExternalPeerCommandInput,
  CreateNetworkGroupExternalPeerCommandInnerOutput
> {
  toRequestParams(params: CreateNetworkGroupExternalPeerCommandInput) {
    return post(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/external-peers`,
      {
        label: params.label,
        ip: params.ip,
        port: params.port,
        peerRole: params.peerRole,
        publicKey: params.publicKey,
        hostname: params.hostname,
        parentEvent: params.parentEvent,
        parentMember: params.parentMember,
      },
    );
  }
}
