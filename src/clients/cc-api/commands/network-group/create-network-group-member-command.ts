import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type {
  CreateNetworkGroupMemberCommandInput,
  CreateNetworkGroupMemberCommandOutput,
} from './create-network-group-member-command.types.js';
import { constructNetworkGroupMember, waitForNetworkGroupMemberCreation } from './network-group-utils.js';

/**
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class CreateNetworkGroupMemberCommand extends CcApiCompositeCommand<
  CreateNetworkGroupMemberCommandInput,
  CreateNetworkGroupMemberCommandOutput
> {
  async compose(
    params: CreateNetworkGroupMemberCommandInput,
    composer: CcApiComposer,
  ): Promise<CreateNetworkGroupMemberCommandOutput> {
    await composer.send(new CreateNetworkGroupMemberCommandInner(params));
    return waitForNetworkGroupMemberCreation(composer, params.ownerId, params.networkGroupId, params.memberId);
  }
}

/**
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members
 * @group NetworkGroup
 * @version 4
 */
class CreateNetworkGroupMemberCommandInner extends CcApiSimpleCommand<CreateNetworkGroupMemberCommandInput, undefined> {
  toRequestParams(params: CreateNetworkGroupMemberCommandInput) {
    return post(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/members`,
      {
        ...constructNetworkGroupMember(params.networkGroupId, params.memberId),
        label: params.label,
      },
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
