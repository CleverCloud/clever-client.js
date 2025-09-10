/**
 * @import { DeleteLogDrainCommandInput } from './delete-log-drain-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteLogDrainCommandInput, void>}
 * @endpoint [DELETE] /v2/logs/:XXX/drains/:XXX
 * @group LogDrain
 * @version 2
 */
export class DeleteLogDrainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteLogDrainCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return delete_(safeUrl`/v2/logs/${resourceId}/drains/${params.drainId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'ADDON_ID',
    };
  }
}
