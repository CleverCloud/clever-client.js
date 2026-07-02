import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetNetworkGroupWireguardConfigurationCommandInput,
  GetNetworkGroupWireguardConfigurationCommandOutput,
} from './get-network-group-wireguard-configuration-command.types.js';

/**
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/peers/:XXX/wireguard/configuration
 * @group NetworkGroup
 * @version 4
 */
export class GetNetworkGroupWireguardConfigurationCommand extends CcApiSimpleCommand<
  GetNetworkGroupWireguardConfigurationCommandInput,
  GetNetworkGroupWireguardConfigurationCommandOutput
> {
  toRequestParams(params: GetNetworkGroupWireguardConfigurationCommandInput): Partial<CcRequestParams> {
    return {
      method: 'GET',
      url: safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}/wireguard/configuration`,
      headers: new HeadersBuilder().acceptTextPlain().build(),
    };
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
