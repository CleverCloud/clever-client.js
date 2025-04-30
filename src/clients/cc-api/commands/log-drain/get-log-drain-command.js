/**
 * @import { GetLogDrainCommandInput, GetLogDrainCommandOutput } from './get-log-drain-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformLogDrain } from './log-drain-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetLogDrainCommandInput, GetLogDrainCommandOutput>}
 * @endpoint [GET] /v2/logs/:XXX/drains/:XXX
 * @group LogDrain
 * @version 2
 */
export class GetLogDrainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetLogDrainCommandInput, GetLogDrainCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return get(safeUrl`/v2/logs/${resourceId}/drains/${params.drainId}`);
  }

  /** @type {CcApiSimpleCommand<GetLogDrainCommandInput, GetLogDrainCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    if (response == null) {
      return null;
    }
    if (response.length === 0) {
      return null;
    }
    return transformLogDrain(response[0]);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'ADDON_ID',
    };
  }
}
