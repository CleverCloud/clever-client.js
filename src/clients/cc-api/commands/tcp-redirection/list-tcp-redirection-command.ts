import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  ListTcpRedirectionCommandInput,
  ListTcpRedirectionCommandOutput,
} from './list-tcp-redirection-command.types.js';

/**
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

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
