import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetNetworkGroupMemberCommandInput,
  GetNetworkGroupMemberCommandOutput,
} from './get-network-group-member-command.types.js';
import { normalizeMemberKind } from './network-group-utils.js';

/**
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class GetNetworkGroupMemberCommand extends CcApiSimpleCommand<
  GetNetworkGroupMemberCommandInput,
  GetNetworkGroupMemberCommandOutput
> {
  toRequestParams(params: GetNetworkGroupMemberCommandInput) {
    return get(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/members/${params.memberId}`,
    );
  }

  transformCommandOutput(response: unknown): GetNetworkGroupMemberCommandOutput {
    return normalizeMemberKind(response as GetNetworkGroupMemberCommandOutput);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
