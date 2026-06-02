import { QueryParams } from '../../../../lib/request/query-params.js';
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteTcpRedirectionCommandInput } from './delete-tcp-redirection-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/tcpRedirs/:XXX
 * @group TcpRedirection
 * @version 2
 */
export class DeleteTcpRedirectionCommand extends CcApiSimpleCommand<DeleteTcpRedirectionCommandInput, void> {
  toRequestParams(params: DeleteTcpRedirectionCommandInput) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tcpRedirs/${params.port}`,
      new QueryParams().append('namespace', params.namespace),
    );
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  transformCommandOutput(): void {
    return null;
  }
}
