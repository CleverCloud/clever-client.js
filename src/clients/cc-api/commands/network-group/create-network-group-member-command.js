/**
 * @import { CreateNetworkGroupMemberCommandInput, CreateNetworkGroupMemberCommandOutput } from './create-network-group-member-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { constructNetworkGroupMember, waitForNetworkGroupMemberCreation } from './network-group-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<CreateNetworkGroupMemberCommandInput, CreateNetworkGroupMemberCommandOutput>}
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class CreateNetworkGroupMemberCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<CreateNetworkGroupMemberCommandInput, CreateNetworkGroupMemberCommandOutput>['compose']} */
  async compose(params, composer) {
    await composer.send(new CreateNetworkGroupMemberCommandInner(params));
    return waitForNetworkGroupMemberCreation(composer, params.ownerId, params.networkGroupId, params.memberId);
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<CreateNetworkGroupMemberCommandInput, CreateNetworkGroupMemberCommandOutput>}
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/members
 * @group NetworkGroup
 * @version 4
 */
class CreateNetworkGroupMemberCommandInner extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateNetworkGroupMemberCommandInput, CreateNetworkGroupMemberCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/members`,
      {
        ...constructNetworkGroupMember(params.networkGroupId, params.memberId),
        label: params.label,
      },
    );
  }

  /** @type {CcApiSimpleCommand<CreateNetworkGroupMemberCommandInput, CreateNetworkGroupMemberCommandOutput>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
