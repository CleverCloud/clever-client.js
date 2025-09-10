/**
 * @import { DeleteNetworkGroupCommandInput } from './delete-network-group-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { waitForNetworkGroupDeletion } from './network-group-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<DeleteNetworkGroupCommandInput, void>}
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @endpoint [GET] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class DeleteNetworkGroupCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<DeleteNetworkGroupCommandInput, void>['compose']} */
  async compose(params, composer) {
    await composer.send(new DeleteNetworkGroupCommandInner(params));
    await waitForNetworkGroupDeletion(composer, params.ownerId, params.networkGroupId);
    return null;
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<DeleteNetworkGroupCommandInput, void>}
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @group NetworkGroup
 * @version 4
 */
class DeleteNetworkGroupCommandInner extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteNetworkGroupCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}`);
  }

  /** @type {CcApiSimpleCommand<DeleteNetworkGroupCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
