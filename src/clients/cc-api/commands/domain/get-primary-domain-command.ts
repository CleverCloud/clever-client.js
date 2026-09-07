import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ApplicationId } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformDomain } from './domain-transform.js';
import type { Domain } from './domain.types.js';
import type {
  GetPrimaryDomainCommandInput,
  GetPrimaryDomainCommandOutput,
} from './get-primary-domain-command.types.js';

/**
 * Reads the favourite domain explicitly set on an application. Answers `404` when there is none.
 *
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class GetPrimaryDomainCommand extends CcApiSimpleCommand<
  GetPrimaryDomainCommandInput,
  GetPrimaryDomainCommandOutput
> {
  toRequestParams(params: ApplicationId) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/favourite`);
  }

  transformCommandOutput(response: unknown): Domain {
    return transformDomain(response, true);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
