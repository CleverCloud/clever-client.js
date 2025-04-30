/**
 * @import { ListTcpRedirectionCommandInput, ListTcpRedirectionCommandOutput } from './list-tcp-redirection-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListTcpRedirectionCommandInput, ListTcpRedirectionCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/tcpRedirs
 * @group TcpRedirection
 * @version 2
 */
export class ListTcpRedirectionCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListTcpRedirectionCommandInput, ListTcpRedirectionCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tcpRedirs`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
