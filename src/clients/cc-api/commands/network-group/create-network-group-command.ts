import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type {
  CreateNetworkGroupCommandInnerInput,
  CreateNetworkGroupCommandInput,
  CreateNetworkGroupCommandOutput,
} from './create-network-group-command.types.js';
import {
  constructNetworkGroupMember,
  generateNetworkGroupId,
  waitForNetworkGroupCreation,
} from './network-group-utils.js';
import type { NetworkGroupMember } from './network-group.types.js';

/**
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class CreateNetworkGroupCommand extends CcApiCompositeCommand<
  CreateNetworkGroupCommandInput,
  CreateNetworkGroupCommandOutput
> {
  async compose(
    params: CreateNetworkGroupCommandInput,
    composer: CcApiComposer,
  ): Promise<CreateNetworkGroupCommandOutput> {
    const networkGroupId = await generateNetworkGroupId();
    await composer.send(new CreateNetworkGroupCommandInner({ ...params, networkGroupId }));
    return waitForNetworkGroupCreation(composer, params.ownerId, networkGroupId);
  }
}

/**
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups
 * @group NetworkGroup
 * @version 4
 */
class CreateNetworkGroupCommandInner extends CcApiSimpleCommand<CreateNetworkGroupCommandInnerInput, undefined> {
  toRequestParams(params: CreateNetworkGroupCommandInnerInput) {
    const body: {
      id: string;
      ownerId: string;
      label?: string;
      description?: string;
      tags?: Array<string>;
      members?: Array<NetworkGroupMember>;
    } = {
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
          label: member.label!,
        };
      });
    }

    return post(safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups`, body);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
