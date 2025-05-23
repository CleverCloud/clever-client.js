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
    return delete_(safeUrl`/v2/organisations/:XXX/addons/:XXX/tags/:XXX`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
