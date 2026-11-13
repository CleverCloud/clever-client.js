import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { GetNetworkGroupCommandInput, GetNetworkGroupCommandOutput } from './get-network-group-command.types.ts';
import { transformNetworkGroup } from './network-group-transform.ts';

/**
 * Retrieves a network group, with its members and its peers.
 *
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class GetNetworkGroupCommand extends CcApiSimpleCommand<
  GetNetworkGroupCommandInput,
  GetNetworkGroupCommandOutput
> {
  toRequestParams(params: GetNetworkGroupCommandInput) {
    return get(safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}`);
  }

  transformCommandOutput(response: unknown): GetNetworkGroupCommandOutput {
    return transformNetworkGroup(response as GetNetworkGroupCommandOutput);
  }

  isIdempotent(): boolean {
    return true;
  }
}
