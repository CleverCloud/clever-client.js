import { QueryParams } from '../../../../lib/request/query-params.ts';
import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { DeleteTcpRedirectionCommandInput } from './delete-tcp-redirection-command.types.ts';

/**
 * Closes a public TCP port of an application and gives it back to the pool.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/tcpRedirs/:XXX
 * @group TcpRedirection
 * @version 2
 */
export class DeleteTcpRedirectionCommand extends CcApiSimpleCommand<DeleteTcpRedirectionCommandInput, undefined> {
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

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
