/**
 * @import { GetNetworkGroupWireguardConfigurationCommandInput, GetNetworkGroupWireguardConfigurationCommandOutput } from './get-network-group-wireguard-configuration-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetNetworkGroupWireguardConfigurationCommandInput, GetNetworkGroupWireguardConfigurationCommandOutput>}
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/peers/:XXX/wireguard/configuration
 * @group NetworkGroup
 * @version 4
 */
export class GetNetworkGroupWireguardConfigurationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetNetworkGroupWireguardConfigurationCommandInput, GetNetworkGroupWireguardConfigurationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}/wireguard/configuration`,
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
