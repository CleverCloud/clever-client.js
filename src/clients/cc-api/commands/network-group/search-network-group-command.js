/**
 * @import { SearchNetworkGroupCommandInput, SearchNetworkGroupCommandOutput } from './search-network-group-command.types.js';
 * @import { NetworkGroupComponent } from './network-group.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<SearchNetworkGroupCommandInput, SearchNetworkGroupCommandOutput>}
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/search
 * @group NetworkGroup
 * @version 4
 */
export class SearchNetworkGroupCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<SearchNetworkGroupCommandInput, SearchNetworkGroupCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/search`,
      new QueryParams().append('query', params.query),
    );
  }

  /** @type {CcApiSimpleCommand<SearchNetworkGroupCommandInput, SearchNetworkGroupCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    if (this.params.types == null || this.params.types.length === 0) {
      return response;
    }

    return response.filter(/** @param {NetworkGroupComponent} item */ (item) => this.params.types.includes(item.type));
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
