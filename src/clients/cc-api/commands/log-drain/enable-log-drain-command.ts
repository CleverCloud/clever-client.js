import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { EnableLogDrainCommandInput, EnableLogDrainCommandOutput } from './enable-log-drain-command.types.js';
import { waitForLogDrainEnabled } from './log-drain-utils.js';

/**
 * Puts a disabled log drain back to work, and waits until it starts shipping again.
 *
 * The transition is asynchronous: the drain goes through `ENABLING` first. This command polls the drain once a
 * second for up to 30 seconds and only resolves once it reports `ENABLED`, throwing if it has not got there in
 * time.
 *
 * @endpoint [PUT] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX/enable
 * @endpoint [GET] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class EnableLogDrainCommand extends CcApiCompositeCommand<
  EnableLogDrainCommandInput,
  EnableLogDrainCommandOutput
> {
  async compose(params: EnableLogDrainCommandInput, composer: CcApiComposer): Promise<EnableLogDrainCommandOutput> {
    await composer.send(new InnerEnableLogDrainCommand(params));
    return waitForLogDrainEnabled(composer, params, params.drainId);
  }
}

/**
 * Requests the enabling of the log drain, without waiting for it to take effect.
 *
 * @endpoint [PUT] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX/enable
 * @group LogDrain
 * @version 4
 */
class InnerEnableLogDrainCommand extends CcApiSimpleCommand<EnableLogDrainCommandInput, undefined> {
  toRequestParams(params: EnableLogDrainCommandInput) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return put(
      safeUrl`/v4/drains/organisations/${params.ownerId}/resources/${resourceId}/drains/${params.drainId}/enable`,
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
