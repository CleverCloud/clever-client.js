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
 * Attaches an external WireGuard peer, a machine outside the Clever Cloud platform, to a member of a network group.
 *
 * Creation is asynchronous: the command polls the peer until it shows up and returns it.
 *
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

  // the API allocates the peer id, so a replay attaches a second peer instead of finding the first one
  isIdempotent(): boolean {
    return false;
  }
}

/**
 * Sends the external peer creation request and returns the id the API allocated for it.
 *
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
        ...(params.peerRole === 'SERVER' ? { ip: params.ip, port: params.port } : {}),
        peerRole: params.peerRole,
        publicKey: params.publicKey,
        hostname: params.hostname,
        parentEvent: params.parentEvent,
        parentMember: params.parentMember,
      },
    );
  }

  // the API allocates the peer id, so a replay attaches a second peer instead of finding the first one
  isIdempotent(): boolean {
    return false;
  }
}
