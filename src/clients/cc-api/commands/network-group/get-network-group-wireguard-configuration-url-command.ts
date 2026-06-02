import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetNetworkGroupWireguardConfigurationUrlCommandInput,
  GetNetworkGroupWireguardConfigurationUrlCommandOutput,
} from './get-network-group-wireguard-configuration-url-command.types.js';

/**
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/peers/:XXX/wireguard/configuration/presigned-url
 * @group NetworkGroup
 * @version 4
 */
export class GetNetworkGroupWireguardConfigurationUrlCommand extends CcApiSimpleCommand<
  GetNetworkGroupWireguardConfigurationUrlCommandInput,
  GetNetworkGroupWireguardConfigurationUrlCommandOutput
> {
  toRequestParams(params: GetNetworkGroupWireguardConfigurationUrlCommandInput) {
    return get(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}/wireguard/configuration/presigned-url`,
    );
  }
}
