import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { normalizeMemberKind } from './network-group-utils.js';
import type {
  SearchNetworkGroupCommandInput,
  SearchNetworkGroupCommandOutput,
} from './search-network-group-command.types.js';

/**
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
    const normalized = components.map((item) => (item.type === 'Member' ? normalizeMemberKind(item) : item));

    if (this.params.types == null || this.params.types.length === 0) {
      return normalized;
    }

    return normalized.filter((item) => this.params.types!.includes(item.type));
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
