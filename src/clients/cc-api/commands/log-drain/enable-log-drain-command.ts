import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { EnableLogDrainCommandInput, EnableLogDrainCommandOutput } from './enable-log-drain-command.types.js';
import { waitForLogDrainEnabled } from './log-drain-utils.js';

/**
 * @endpoint [PUT] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX/enable
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class EnableLogDrainCommand extends CcApiCompositeCommand<
  EnableLogDrainCommandInput,
  EnableLogDrainCommandOutput
> {
  async compose(params: EnableLogDrainCommandInput, composer: CcApiComposer): Promise<EnableLogDrainCommandOutput> {
    await composer.send(new InnerEnableLogDrainCommand(params));
    return waitForLogDrainEnabled(composer, params.ownerId, params.applicationId, params.drainId);
  }
}

/**
 * @endpoint [PUT] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX/enable
 * @group LogDrain
 * @version 4
 */
class InnerEnableLogDrainCommand extends CcApiSimpleCommand<EnableLogDrainCommandInput, void> {
  toRequestParams(params: EnableLogDrainCommandInput) {
    return put(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains/${params.drainId}/enable`,
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
