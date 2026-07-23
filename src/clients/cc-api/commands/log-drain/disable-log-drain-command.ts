import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DisableLogDrainCommandInput, DisableLogDrainCommandOutput } from './disable-log-drain-command.types.js';
import { waitForLogDrainDisabled } from './log-drain-utils.js';

/**
 * Stops a log drain from shipping logs, without deleting it, and waits until it has actually stopped.
 *
 * The transition is asynchronous: the drain goes through `DISABLING` first. This command polls the drain once
 * a second for up to 30 seconds and only resolves once it reports `DISABLED`, throwing if it has not got there
 * in time.
 *
 * @endpoint [PUT] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX/disable
 * @endpoint [GET] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class DisableLogDrainCommand extends CcApiCompositeCommand<
  DisableLogDrainCommandInput,
  DisableLogDrainCommandOutput
> {
  async compose(params: DisableLogDrainCommandInput, composer: CcApiComposer): Promise<DisableLogDrainCommandOutput> {
    await composer.send(new InnerDisableLogDrainCommand(params));
    return waitForLogDrainDisabled(composer, params, params.drainId);
  }
}

/**
 * Requests the disabling of the log drain, without waiting for it to take effect.
 *
 * @endpoint [PUT] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX/disable
 * @group LogDrain
 * @version 4
 */
class InnerDisableLogDrainCommand extends CcApiSimpleCommand<DisableLogDrainCommandInput, undefined> {
  toRequestParams(params: DisableLogDrainCommandInput) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return put(
      safeUrl`/v4/drains/organisations/${params.ownerId}/resources/${resourceId}/drains/${params.drainId}/disable`,
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
