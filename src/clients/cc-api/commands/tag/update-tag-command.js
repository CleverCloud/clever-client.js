/**
 * @import { UpdateTagCommandInput, UpdateTagCommandOutput } from './update-tag-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateTagCommandInput, UpdateTagCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/addons/:XXX/tags
 * @group Tag
 * @version 2
 */
export class UpdateTagCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateTagCommandInput, UpdateTagCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    if ('applicationId' in params) {
      return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tags`, params.tags);
    }
    return put(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/tags`, params.tags);
  }

  /** @type {CcApiSimpleCommand<UpdateTagCommandInput, UpdateTagCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response?.sort() ?? [];
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
