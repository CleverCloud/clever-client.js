/**
 * @import { DeleteLogDrainCommandInput, DeleteLogDrainCommandOutput } from './delete-log-drain-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteLogDrainCommandInput, DeleteLogDrainCommandOutput>}
 * @endpoint [DELETE] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class DeleteLogDrainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteLogDrainCommandInput, DeleteLogDrainCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains/${params.drainId}`,
    );
  }

  /** @type {CcApiSimpleCommand<DeleteLogDrainCommandInput, DeleteLogDrainCommandOutput>['transformCommandOutput']} */
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
