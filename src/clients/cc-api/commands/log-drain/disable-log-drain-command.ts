import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DisableLogDrainCommandInput, DisableLogDrainCommandOutput } from './disable-log-drain-command.types.js';
import { waitForLogDrainDisabled } from './log-drain-utils.js';

/**
 * @endpoint [PUT] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX/disable
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class DisableLogDrainCommand extends CcApiCompositeCommand<
  DisableLogDrainCommandInput,
  DisableLogDrainCommandOutput
> {
  async compose(params: DisableLogDrainCommandInput, composer: CcApiComposer): Promise<DisableLogDrainCommandOutput> {
    await composer.send(new InnerDisableLogDrainCommand(params));
    return waitForLogDrainDisabled(composer, params.ownerId, params.applicationId, params.drainId);
  }
}

/**
 * @endpoint [PUT] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX/disable
 * @group LogDrain
 * @version 4
 */
class InnerDisableLogDrainCommand extends CcApiSimpleCommand<DisableLogDrainCommandInput, void> {
  toRequestParams(params: DisableLogDrainCommandInput) {
    return put(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains/${params.drainId}/disable`,
    );
  }

  transformCommandOutput(): void {
    return null;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
