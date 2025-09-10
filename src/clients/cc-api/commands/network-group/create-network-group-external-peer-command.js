/**
 * @import { CreateNetworkGroupExternalPeerCommandInput, CreateNetworkGroupExternalPeerCommandOutput, CreateNetworkGroupExternalPeerCommandInnerOutput } from './create-network-group-external-peer-command.types.js';
 * @import { NetworkGroupPeerExternal } from './network-group.types.js'; */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { waitForNetworkGroupPeerCreation } from './network-group-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<CreateNetworkGroupExternalPeerCommandInput, CreateNetworkGroupExternalPeerCommandOutput>}
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/peers/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class CreateNetworkGroupExternalPeerCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<CreateNetworkGroupExternalPeerCommandInput, CreateNetworkGroupExternalPeerCommandOutput>['compose']} */
  async compose(params, composer) {
    const peer = await composer.send(new CreateNetworkGroupExternalPeerCommandInner({ ...params }));
    return /** @type {NetworkGroupPeerExternal} */ (
      await waitForNetworkGroupPeerCreation(composer, params.ownerId, params.networkGroupId, peer.peerId)
    );
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<CreateNetworkGroupExternalPeerCommandInput, CreateNetworkGroupExternalPeerCommandInnerOutput>}
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers
 * @group NetworkGroup
 * @version 4
 */
class CreateNetworkGroupExternalPeerCommandInner extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateNetworkGroupExternalPeerCommandInput, CreateNetworkGroupExternalPeerCommandInnerOutput>['toRequestParams']} */
  toRequestParams(params) {
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
