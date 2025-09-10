/**
 * @import { CreateNetworkGroupCommandInput, CreateNetworkGroupCommandOutput, CreateNetworkGroupCommandInnerInput } from './create-network-group-command.types.js';
 *
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import {
  constructNetworkGroupMember,
  generateNetworkGroupId,
  waitForNetworkGroupCreation,
} from './network-group-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<CreateNetworkGroupCommandInput, CreateNetworkGroupCommandOutput>}
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class CreateNetworkGroupCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<CreateNetworkGroupCommandInput, CreateNetworkGroupCommandOutput>['compose']} */
  async compose(params, composer) {
    const networkGroupId = await generateNetworkGroupId();
    await composer.send(new CreateNetworkGroupCommandInner({ ...params, networkGroupId }));
    return waitForNetworkGroupCreation(composer, params.ownerId, networkGroupId);
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<CreateNetworkGroupCommandInnerInput, void>}
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups
 * @group NetworkGroup
 * @version 4
 */
class CreateNetworkGroupCommandInner extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateNetworkGroupCommandInnerInput, void>['toRequestParams']} */
  async toRequestParams(params) {
    /** @type {any} */
    const body = {
      id: params.networkGroupId,
      ownerId: params.ownerId,
      label: params.label,
      description: params.description,
      tags: params.tags,
    };

    if (params.members != null && params.members.length > 0) {
      body.members = params.members.map((member) => {
        return {
          ...constructNetworkGroupMember(params.networkGroupId, member.id),
          label: member.label,
        };
      });
    }

    return post(safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups`, body);
  }

  /** @type {CcApiSimpleCommand<CreateNetworkGroupCommandInnerInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
