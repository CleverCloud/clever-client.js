/**
 * @import { GetNetworkGroupWireguardConfigurationCommandInput, GetNetworkGroupWireguardConfigurationCommandOutput } from './get-network-group-wireguard-configuration-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
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
    return {
      method: 'GET',
      url: safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}/wireguard/configuration`,
      headers: new HeadersBuilder().acceptTextPlain().build(),
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
