/**
 * @import { ResetLogDrainCursorCommandInput } from './reset-log-drain-cursor-command.types.js';
 */
import { patch } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ResetLogDrainCursorCommandInput, void>}
 * @endpoint [PATCH] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX/reset-cursor
 * @group LogDrain
 * @version 4
 */
export class ResetLogDrainCursorCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ResetLogDrainCursorCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return patch(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains/${params.drainId}/reset-cursor`,
    );
  }

  /** @type {CcApiSimpleCommand<ResetLogDrainCursorCommandInput, void>['transformCommandOutput']} */
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
