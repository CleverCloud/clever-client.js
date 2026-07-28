import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetNetworkGroupWireguardConfigurationUrlCommandInput,
  GetNetworkGroupWireguardConfigurationUrlCommandOutput,
} from './get-network-group-wireguard-configuration-url-command.types.js';

/**
 * Retrieves a presigned URL from which the WireGuard configuration of a peer can be downloaded without
 * authentication.
 *
 * The URL is short lived and grants access to the peer private key, so treat it as a secret.
 *
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

  // the URL is signed on the fly and the token is not stored anywhere, so a replay only mints a second short lived one
  isIdempotent(): boolean {
    return true;
  }
}
