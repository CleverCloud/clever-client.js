import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { GetLogDrainCommandInput, GetLogDrainCommandOutput } from './get-log-drain-command.types.ts';
import { transformLogDrain } from './log-drain-transform.ts';

/**
 * Retrieves a log drain of an application or an add-on, with its status and its shipping backlog.
 *
 * @endpoint [GET] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class GetLogDrainCommand extends CcApiSimpleCommand<GetLogDrainCommandInput, GetLogDrainCommandOutput> {
  toRequestParams(params: GetLogDrainCommandInput) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return get(safeUrl`/v4/drains/organisations/${params.ownerId}/resources/${resourceId}/drains/${params.drainId}`);
  }

  transformCommandOutput(response: unknown): GetLogDrainCommandOutput {
    return transformLogDrain(response as Parameters<typeof transformLogDrain>[0]);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
