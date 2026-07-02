import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  CreateTcpRedirectionCommandInput,
  CreateTcpRedirectionCommandOutput,
} from './create-tcp-redirection-command.types.js';

/**
 * @endpoint [POST] /v2/organisations/:XXX/applications/:XXX/tcpRedirs
 * @group TcpRedirection
 * @version 2
 */
export class CreateTcpRedirectionCommand extends CcApiSimpleCommand<
  CreateTcpRedirectionCommandInput,
  CreateTcpRedirectionCommandOutput
> {
  toRequestParams(params: CreateTcpRedirectionCommandInput) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tcpRedirs`, {
      namespace: params.namespace ?? 'default',
    });
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
