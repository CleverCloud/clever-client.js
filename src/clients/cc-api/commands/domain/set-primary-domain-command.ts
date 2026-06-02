import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { SetPrimaryDomainCommandInput } from './set-primary-domain-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class SetPrimaryDomainCommand extends CcApiSimpleCommand<SetPrimaryDomainCommandInput, void> {
  toRequestParams(params: SetPrimaryDomainCommandInput) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/favourite`, {
      fqdn: params.domain,
    });
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
