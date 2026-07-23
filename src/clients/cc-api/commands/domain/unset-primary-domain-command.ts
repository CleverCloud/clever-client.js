import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { UnsetPrimaryDomainCommandInput } from './unset-primary-domain-command.types.js';

/**
 * Clears the primary domain of an application.
 *
 * The application keeps every domain it answers on; only the favourite mark is removed, and the
 * primary domain falls back to being guessed.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class UnsetPrimaryDomainCommand extends CcApiSimpleCommand<UnsetPrimaryDomainCommandInput, undefined> {
  toRequestParams(params: UnsetPrimaryDomainCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/favourite`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
