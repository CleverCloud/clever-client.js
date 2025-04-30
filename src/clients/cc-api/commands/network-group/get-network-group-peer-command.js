/**
 * @import { GetNetworkGroupPeerCommandInput, GetNetworkGroupPeerCommandOutput } from './get-network-group-peer-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetNetworkGroupPeerCommandInput, GetNetworkGroupPeerCommandOutput>}
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/peers/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class GetNetworkGroupPeerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetNetworkGroupPeerCommandInput, GetNetworkGroupPeerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}`,
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
