import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  ListNetworkGroupCommandInput,
  ListNetworkGroupCommandOutput,
} from './list-network-group-command.types.js';
import { normalizeMemberKind } from './network-group-utils.js';

/**
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups
 * @group NetworkGroup
 * @version 4
 */
export class ListNetworkGroupCommand extends CcApiSimpleCommand<
  ListNetworkGroupCommandInput,
  ListNetworkGroupCommandOutput
> {
  toRequestParams(params: ListNetworkGroupCommandInput) {
    return get(safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups`);
  }

  transformCommandOutput(response: unknown): ListNetworkGroupCommandOutput {
    return (response as ListNetworkGroupCommandOutput).map((networkGroup) => ({
      ...networkGroup,
      members: networkGroup.members.map(normalizeMemberKind),
    }));
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
