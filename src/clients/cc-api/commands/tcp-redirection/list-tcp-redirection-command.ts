import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  ListTcpRedirectionCommandInput,
  ListTcpRedirectionCommandOutput,
} from './list-tcp-redirection-command.types.js';

/**
 * Lists the public TCP ports routed to an application.
 *
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/tcpRedirs
 * @group TcpRedirection
 * @version 2
 */
export class ListTcpRedirectionCommand extends CcApiSimpleCommand<
  ListTcpRedirectionCommandInput,
  ListTcpRedirectionCommandOutput
> {
  toRequestParams(params: ListTcpRedirectionCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tcpRedirs`);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
