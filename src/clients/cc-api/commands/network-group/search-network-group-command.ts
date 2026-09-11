import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import {
  transformNetworkGroup,
  transformNetworkGroupMember,
  transformNetworkGroupPeer,
} from './network-group-transform.js';
import type {
  SearchNetworkGroupCommandInput,
  SearchNetworkGroupCommandOutput,
} from './search-network-group-command.types.js';

/**
 * Searches the network groups of an organisation, and their members and peers, by id or by label.
 *
 * The API returns every kind of component matching the query; the `types` input filters the result client side.
 *
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/search
 * @group NetworkGroup
 * @version 4
 */
export class SearchNetworkGroupCommand extends CcApiSimpleCommand<
  SearchNetworkGroupCommandInput,
  SearchNetworkGroupCommandOutput
> {
  toRequestParams(params: SearchNetworkGroupCommandInput) {
    return get(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/search`,
      new QueryParams().append('query', params.query),
    );
  }

  transformCommandOutput(response: unknown): SearchNetworkGroupCommandOutput {
    const components = response as SearchNetworkGroupCommandOutput;
    const normalized = components.map((item) => {
      if (item.type === 'NetworkGroup') {
        return transformNetworkGroup(item);
      }
      if (item.type === 'Member') {
        return transformNetworkGroupMember(item);
      }
      if (item.type === 'CleverPeer' || item.type === 'ExternalPeer') {
        return transformNetworkGroupPeer(item);
      }
      return item;
    });

    if (this.params.types == null || this.params.types.length === 0) {
      return normalized;
    }

    // a component type this client does not know matches no requested type, so it drops out here
    const requestedTypes: Array<string> = this.params.types;
    return normalized.filter((item) => requestedTypes.includes(item.type));
  }

  isIdempotent(): boolean {
    return true;
  }
}
