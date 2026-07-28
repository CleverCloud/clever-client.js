import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { CheckLogDrainCommandInput, CheckLogDrainCommandOutput } from './check-log-drain-command.types.js';

/**
 * Probes the recipient of a log drain server-side, to check whether it can be reached.
 *
 * The probe always resolves, whether or not the recipient answered: read `ok` to tell success from failure, and
 * `code`/`message` for the debug detail. Nothing about the drain is changed.
 *
 * @endpoint [POST] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX/check
 * @group LogDrain
 * @version 4
 */
export class CheckLogDrainCommand extends CcApiSimpleCommand<CheckLogDrainCommandInput, CheckLogDrainCommandOutput> {
  toRequestParams(params: CheckLogDrainCommandInput) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return post(
      safeUrl`/v4/drains/organisations/${params.ownerId}/resources/${resourceId}/drains/${params.drainId}/check`,
    );
  }

  transformCommandOutput(response: unknown): CheckLogDrainCommandOutput {
    return response as CheckLogDrainCommandOutput;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  // the probe posts a sample log line to the recipient, so a replay ships a second one to the target
  isIdempotent(): boolean {
    return false;
  }
}
