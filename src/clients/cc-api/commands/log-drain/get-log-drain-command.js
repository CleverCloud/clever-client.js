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
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class GetLogDrainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetLogDrainCommandInput, GetLogDrainCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains/${params.drainId}`,
    );
  }

  /** @type {CcApiSimpleCommand<GetLogDrainCommandInput, GetLogDrainCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformLogDrain(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
