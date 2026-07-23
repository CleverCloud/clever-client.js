import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  ListTcpRedirectionNamespaceCommandInput,
  ListTcpRedirectionNamespaceCommandOutput,
} from './list-tcp-redirection-namespace-command.types.js';

/**
 * Lists the load balancer pools an organisation may open TCP ports in.
 *
 * @endpoint [GET] /v2/organisations/:XXX/namespaces
 * @group TcpRedirection
 * @version 2
 */
export class ListTcpRedirectionNamespaceCommand extends CcApiSimpleCommand<
  ListTcpRedirectionNamespaceCommandInput,
  ListTcpRedirectionNamespaceCommandOutput
> {
  toRequestParams(params: ListTcpRedirectionNamespaceCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/namespaces`);
  }
}
