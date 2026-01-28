/**
 * @import { DisableLogDrainCommandInput, DisableLogDrainCommandOutput } from './disable-log-drain-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { waitForLogDrainDisabled } from './log-drain-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<DisableLogDrainCommandInput, DisableLogDrainCommandOutput>}
 * @endpoint [PUT] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX/disable
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class DisableLogDrainCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<DisableLogDrainCommandInput, DisableLogDrainCommandOutput>['compose']} */
  async compose(params, composer) {
    await composer.send(new InnerDisableLogDrainCommand(params));
    return waitForLogDrainDisabled(composer, params.ownerId, params.applicationId, params.drainId);
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<DisableLogDrainCommandInput, void>}
 * @endpoint [PUT] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX/disable
 * @group LogDrain
 * @version 4
 */
class InnerDisableLogDrainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DisableLogDrainCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains/${params.drainId}/disable`,
    );
  }

  /** @type {CcApiSimpleCommand<DisableLogDrainCommandInput, void>['transformCommandOutput']} */
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
