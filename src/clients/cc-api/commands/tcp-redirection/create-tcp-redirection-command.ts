/**
 * @import { CreateTcpRedirectionCommandInput, CreateTcpRedirectionCommandOutput } from './create-tcp-redirection-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateTcpRedirectionCommandInput, CreateTcpRedirectionCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/applications/:XXX/tcpRedirs
 * @group TcpRedirection
 * @version 2
 */
export class CreateTcpRedirectionCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateTcpRedirectionCommandInput, CreateTcpRedirectionCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tcpRedirs`, {
      namespace: params.namespace ?? 'default',
    });
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
