/**
 * @import { ListTagCommandInput, ListTagCommandOutput } from './list-tag-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListTagCommandInput, ListTagCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/tags
 * @group Tag
 * @version 2
 */
export class ListTagCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListTagCommandInput, ListTagCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    if ('applicationId' in params) {
      return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tags`);
    }
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/tags`);
  }

  /** @type {CcApiSimpleCommand<ListTagCommandInput, ListTagCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response?.sort() ?? [];
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
