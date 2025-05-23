/**
 * @import { DeleteNetworkGroupExternalPeerCommandInput } from './delete-network-group-external-peer-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteNetworkGroupExternalPeerCommandInput, void>}
 * @endpoint [DELETE] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers/:XXX
 * @group NetworkGroup
 * @version 4
 */
export class DeleteNetworkGroupExternalPeerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteNetworkGroupExternalPeerCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers/:XXX`);
  }
}
