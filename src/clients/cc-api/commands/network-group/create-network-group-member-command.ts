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
 * Adds a member, an application or an add-on, to a network group.
 *
 * The member kind and its network group domain name are derived from the member id, client side. Creation is
 * asynchronous: the command polls the member until it shows up and returns it.
 *
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
 * Sends the member creation request.
 *
 * The endpoint answers `202 Accepted` with no body: the member is added asynchronously.
 *
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
