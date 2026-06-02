/**
 * @import { ListTcpRedirectionNamespaceCommandInput, ListTcpRedirectionNamespaceCommandOutput } from './list-tcp-redirection-namespace-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListTcpRedirectionNamespaceCommandInput, ListTcpRedirectionNamespaceCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/namespaces
 * @group TcpRedirection
 * @version 2
 */
export class ListTcpRedirectionNamespaceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListTcpRedirectionNamespaceCommandInput, ListTcpRedirectionNamespaceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/namespaces`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
