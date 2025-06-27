/**
 * @import { DeleteNetworkGroupExternalPeerCommandInput } from './delete-network-group-external-peer-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { waitForNetworkGroupPeerDeletion } from './network-group-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<DeleteNetworkGroupExternalPeerCommandInput, void>}
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers/:XXX
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/peers/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class DeleteNetworkGroupExternalPeerCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<DeleteNetworkGroupExternalPeerCommandInput, void>['compose']} */
  async compose(params, composer) {
    await composer.send(new DeleteNetworkGroupExternalPeerCommandInner(params));
    await waitForNetworkGroupPeerDeletion(composer, params.ownerId, params.networkGroupId, params.externalPeerId);
    return null;
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<DeleteNetworkGroupExternalPeerCommandInput, void>}
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers/:XXX
 * @group NetworkGroup
 * @version 4
 */
class DeleteNetworkGroupExternalPeerCommandInner extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteNetworkGroupExternalPeerCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/external-peers/${params.externalPeerId}`,
    );
  }

  /** @type {CcApiSimpleCommand<DeleteNetworkGroupExternalPeerCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
