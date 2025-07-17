/**
 * @import { DeleteApplicationCommandInput } from './delete-application-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteApplicationCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX
 * @group Application
 * @version 2
 */
export class DeleteApplicationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteApplicationCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}`);
  }

  /** @type {CcApiSimpleCommand<DeleteApplicationCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
