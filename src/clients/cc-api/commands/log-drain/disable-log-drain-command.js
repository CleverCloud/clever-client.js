/**
 * @import { DisableLogDrainCommandInput } from './disable-log-drain-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DisableLogDrainCommandInput, void>}
 * @endpoint [PUT] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX/disable
 * @group LogDrain
 * @version 4
 */
export class DisableLogDrainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DisableLogDrainCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains/${params.drainId}/disable`,
    );
  }

  /** @type {CcApiSimpleCommand<DisableLogDrainCommandInput, void>['transformCommandOutput']} */
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
