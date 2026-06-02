import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetNetworkGroupPeerCommandInput,
  GetNetworkGroupPeerCommandOutput,
} from './get-network-group-peer-command.types.js';

/**
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/peers/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class GetNetworkGroupPeerCommand extends CcApiSimpleCommand<
  GetNetworkGroupPeerCommandInput,
  GetNetworkGroupPeerCommandOutput
> {
  toRequestParams(params: GetNetworkGroupPeerCommandInput) {
    return get(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}`,
    );
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
