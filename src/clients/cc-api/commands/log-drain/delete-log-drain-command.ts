import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteLogDrainCommandInput } from './delete-log-drain-command.types.js';

/**
 * @endpoint [DELETE] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class DeleteLogDrainCommand extends CcApiSimpleCommand<DeleteLogDrainCommandInput, undefined> {
  toRequestParams(params: DeleteLogDrainCommandInput) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return delete_(
      safeUrl`/v4/drains/organisations/${params.ownerId}/resources/${resourceId}/drains/${params.drainId}`,
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
