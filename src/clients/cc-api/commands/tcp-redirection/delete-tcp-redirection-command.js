/**
 * @import { DeleteTcpRedirectionCommandInput } from './delete-tcp-redirection-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteTcpRedirectionCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/tcpRedirs/:XXX
 * @group TcpRedirection
 * @version 2
 */
export class DeleteTcpRedirectionCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteTcpRedirectionCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tcpRedirs/${params.port}`,
      new QueryParams().append('namespace', params.namespace),
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }

  /** @type {CcApiSimpleCommand<DeleteTcpRedirectionCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
