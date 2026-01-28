/**
 * @import { EnableLogDrainCommandInput, EnableLogDrainCommandOutput } from './enable-log-drain-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { waitForLogDrainEnabled } from './log-drain-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<EnableLogDrainCommandInput, EnableLogDrainCommandOutput>}
 * @endpoint [PUT] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX/enable
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class EnableLogDrainCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<EnableLogDrainCommandInput, EnableLogDrainCommandOutput>['compose']} */
  async compose(params, composer) {
    await composer.send(new InnerEnableLogDrainCommand(params));
    return waitForLogDrainEnabled(composer, params.ownerId, params.applicationId, params.drainId);
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<EnableLogDrainCommandInput, void>}
 * @endpoint [PUT] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX/enable
 * @group LogDrain
 * @version 4
 */
class InnerEnableLogDrainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<EnableLogDrainCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains/${params.drainId}/enable`,
    );
  }

  /** @type {CcApiSimpleCommand<EnableLogDrainCommandInput, void>['transformCommandOutput']} */
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
