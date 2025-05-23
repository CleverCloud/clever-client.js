/**
 * @import { CreateNetworkGroupCommandInput, CreateNetworkGroupCommandOutput } from './create-network-group-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateNetworkGroupCommandInput, CreateNetworkGroupCommandOutput>}
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups
 * @group NetworkGroup
 * @version 4
 */
export class CreateNetworkGroupCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateNetworkGroupCommandInput, CreateNetworkGroupCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/networkgroups/organisations/:XXX/networkgroups`, {});
  }
}
