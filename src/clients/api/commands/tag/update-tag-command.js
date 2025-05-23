/**
 * @import { UpdateTagCommandInput, UpdateTagCommandOutput } from './update-tag-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateTagCommandInput, UpdateTagCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/addons/:XXX/tags/:XXX
 * @group Tag
 * @version 2
 */
export class UpdateTagCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateTagCommandInput, UpdateTagCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/organisations/:XXX/addons/:XXX/tags/:XXX`, {});
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID', // ???
    };
  }
}
