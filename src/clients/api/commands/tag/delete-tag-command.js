/**
 * @import { DeleteTagCommandInput, DeleteTagCommandOutput } from './delete-tag-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteTagCommandInput, DeleteTagCommandOutput>}
 * @endpoint [DELETE] /v2/organisations/:XXX/addons/:XXX/tags/:XXX
 * @group Tag
 * @version 2
 */
export class DeleteTagCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteTagCommandInput, DeleteTagCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    if ('applicationId' in params) {
      return delete_(
        safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tags/${params.tag}`,
      );
    }
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/tags/${params.tag}`);
  }

  /** @type {CcApiSimpleCommand<DeleteTagCommandInput, DeleteTagCommandOutput>['transformCommandOutput']} */
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
