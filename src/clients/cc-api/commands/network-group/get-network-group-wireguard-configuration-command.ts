import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetNetworkGroupWireguardConfigurationCommandInput,
  GetNetworkGroupWireguardConfigurationCommandOutput,
} from './get-network-group-wireguard-configuration-command.types.js';

/**
 * Retrieves the WireGuard configuration file of a peer, as plain text.
 *
 * The configuration is what the peer needs to join the network group: it holds its private key, so treat it as a
 * secret.
 *
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

  // the configuration is rendered from what the API already knows about the peer, no key is generated
  isIdempotent(): boolean {
    return true;
  }
}
