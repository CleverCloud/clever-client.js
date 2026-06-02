import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { CreateDomainCommandInput } from './create-domain-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/vhosts/:XXX
 * @group Domain
 * @version 2
 */
export class CreateDomainCommand extends CcApiSimpleCommand<CreateDomainCommandInput, void> {
  toRequestParams(params: CreateDomainCommandInput) {
    return put(
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
