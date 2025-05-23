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
    return get(safeUrl`/v2/organisations/:XXX/addons/:XXX/tags`);
  }

  /** @type {CcApiSimpleCommand<ListTagCommandInput, ListTagCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID', // ???
    };
  }
}
