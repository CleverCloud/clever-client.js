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
 * Creates a network group in an organisation, optionally with a first set of members.
 *
 * The network group id is generated client side, because the creation endpoint answers before the network group
 * exists. The command then polls the network group until it shows up and returns it.
 *
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

  // a fresh network group id is generated on every run, so a replay creates a second network group
  isIdempotent(): boolean {
    return false;
  }
}

/**
 * Sends the network group creation request, with the client generated id.
 *
 * The endpoint answers `202 Accepted` with no body: the network group is created asynchronously.
 *
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

  // the id travels in the body and the API reserves it, so a replay is refused rather than creating a second one
  isIdempotent(): boolean {
    return true;
  }
}
