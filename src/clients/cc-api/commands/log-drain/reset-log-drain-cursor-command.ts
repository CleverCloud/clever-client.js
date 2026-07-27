import { patch } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  ResetLogDrainCursorCommandInput,
  ResetLogDrainCursorCommandOutput,
} from './reset-log-drain-cursor-command.types.js';
import { transformLogDrain } from './log-drain-transform.js';

/**
 * Resets the shipping cursor of a log drain to now, so it stops trying to catch up on its backlog and only
 * ships logs produced from this point on.
 *
 * @endpoint [PATCH] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX/reset-cursor
 * @group LogDrain
 * @version 4
 */
export class ResetLogDrainCursorCommand extends CcApiSimpleCommand<
  ResetLogDrainCursorCommandInput,
  ResetLogDrainCursorCommandOutput
> {
  toRequestParams(params: ResetLogDrainCursorCommandInput) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return patch(
      safeUrl`/v4/drains/organisations/${params.ownerId}/resources/${resourceId}/drains/${params.drainId}/reset-cursor`,
    );
  }

  transformCommandOutput(response: unknown): ResetLogDrainCursorCommandOutput {
    return transformLogDrain(response as Parameters<typeof transformLogDrain>[0], this.params);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
