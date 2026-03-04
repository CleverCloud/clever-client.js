/**
 * @import { GetNetworkGroupWireguardConfigurationUrlCommandInput, GetNetworkGroupWireguardConfigurationUrlCommandOutput } from './get-network-group-wireguard-configuration-url-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * @extends {CcApiSimpleCommand<GetNetworkGroupWireguardConfigurationUrlCommandInput, GetNetworkGroupWireguardConfigurationUrlCommandOutput>}
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/peers/:XXX/wireguard/configuration/presigned-url
 * @group NetworkGroup
 * @version 4
 */
export class GetNetworkGroupWireguardConfigurationUrlCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetNetworkGroupWireguardConfigurationUrlCommandInput, GetNetworkGroupWireguardConfigurationUrlCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}/wireguard/configuration/presigned-url`,
    );
  }
}
