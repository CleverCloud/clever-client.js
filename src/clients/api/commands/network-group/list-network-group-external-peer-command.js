/**
 * @import { ListNetworkGroupExternalPeerCommandInput, ListNetworkGroupExternalPeerCommandOutput } from './list-network-group-external-peer-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListNetworkGroupExternalPeerCommandInput, ListNetworkGroupExternalPeerCommandOutput>}
 * @endpoint [POST] /v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers
 * @group NetworkGroup
 * @version 4
 */
export class ListNetworkGroupExternalPeerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListNetworkGroupExternalPeerCommandInput, ListNetworkGroupExternalPeerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/networkgroups/organisations/:XXX/networkgroups/:XXX/external-peers`, {});
  }
}
