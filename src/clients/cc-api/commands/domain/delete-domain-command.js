/**
 * @import { DeleteDomainCommandInput } from './delete-domain-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteDomainCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/vhosts/:XXX
 * @group Domain
 * @version 2
 */
export class DeleteDomainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteDomainCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/${params.domain}`,
    );
  }

  /** @type {CcApiSimpleCommand<DeleteDomainCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput(_response) {
    return null;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
