import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetLogDrainCommandInput, GetLogDrainCommandOutput } from './get-log-drain-command.types.js';
import { transformLogDrain } from './log-drain-transform.js';

/**
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
    return transformLogDrain(response as Parameters<typeof transformLogDrain>[0], this.params);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
