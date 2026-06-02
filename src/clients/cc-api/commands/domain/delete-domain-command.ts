import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteDomainCommandInput } from './delete-domain-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/vhosts/:XXX
 * @group Domain
 * @version 2
 */
export class DeleteDomainCommand extends CcApiSimpleCommand<DeleteDomainCommandInput, void> {
  toRequestParams(params: DeleteDomainCommandInput) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/${params.domain}`,
    );
  }

  transformCommandOutput(): void {
    return null;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
