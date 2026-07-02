import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetNetworkGroupCommandInput, GetNetworkGroupCommandOutput } from './get-network-group-command.types.js';
import { normalizeMemberKind } from './network-group-utils.js';

/**
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
    const networkGroup = response as GetNetworkGroupCommandOutput;
    return {
      ...networkGroup,
      members: networkGroup.members.map(normalizeMemberKind),
    };
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
