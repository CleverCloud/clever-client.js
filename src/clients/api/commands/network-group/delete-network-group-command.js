/**
 * @import { DeleteNetworkGroupCommandInput } from './delete-network-group-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteNetworkGroupCommandInput, void>}
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class DeleteNetworkGroupCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteNetworkGroupCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v4/networkgroups/organisations/:XXX/networkgroups/:XXX`);
  }
}
