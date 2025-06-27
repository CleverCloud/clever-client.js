/**
 * @import { UpdateLogDrainCommandInput, UpdateLogDrainCommandOutput } from './update-log-drain-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformLogDrain } from './log-drain-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateLogDrainCommandInput, UpdateLogDrainCommandOutput>}
 * @endpoint [PUT] /v2/logs/:XXX/drains/:XXX/state
 * @group LogDrain
 * @version 2
 */
export class UpdateLogDrainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateLogDrainCommandInput, UpdateLogDrainCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return put(safeUrl`/v2/logs/${resourceId}/drains/${params.drainId}/state`, { state: params.state });
  }

  /** @type {CcApiSimpleCommand<UpdateLogDrainCommandInput, UpdateLogDrainCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformLogDrain(response[0]);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'ADDON_ID',
    };
  }
}
