import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  ListNetworkGroupCommandInput,
  ListNetworkGroupCommandOutput,
} from './list-network-group-command.types.ts';
import { transformNetworkGroup } from './network-group-transform.ts';

/**
 * Lists the network groups of an organisation, with their members and peers.
 *
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
    return (response as ListNetworkGroupCommandOutput).map(transformNetworkGroup);
  }

  isIdempotent(): boolean {
    return true;
  }
}
