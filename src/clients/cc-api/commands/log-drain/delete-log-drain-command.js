/**
 * @import { DeleteLogDrainCommandInput, DeleteLogDrainCommandOutput } from './delete-log-drain-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { GetLogDrainCommand } from './get-log-drain-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<DeleteLogDrainCommandInput, DeleteLogDrainCommandOutput>}
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @endpoint [DELETE] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class DeleteLogDrainCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<DeleteLogDrainCommandInput, DeleteLogDrainCommandOutput>['compose']} */
  async compose(params, composer) {
    // Fetch the drain before deleting so we can return it
    const drain = await composer.send(new GetLogDrainCommand(params));

    await composer.send(new DeleteLogDrainInnerCommand(params));

    return drain;
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<DeleteLogDrainCommandInput, void>}
 * @endpoint [DELETE] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
class DeleteLogDrainInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteLogDrainCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains/${params.drainId}`,
    );
  }

  /** @type {CcApiSimpleCommand<DeleteLogDrainCommandInput, void>['transformCommandOutput']} */
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
