/**
 * @import { CreateTagCommandInput, CreateTagCommandOutput } from './create-tag-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateTagCommandInput, CreateTagCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/addons/:XXX/tags
 * @group Tag
 * @version 2
 */
export class CreateTagCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateTagCommandInput, CreateTagCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    if ('applicationId' in params) {
      return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tags/${params.tag}`);
    }
    return put(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/tags/${params.tag}`);
  }

  /** @type {CcApiSimpleCommand<CreateTagCommandInput, CreateTagCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.sort();
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
