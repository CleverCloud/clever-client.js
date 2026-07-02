import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformDomain } from './domain-transform.js';
import type {
  GetPrimaryDomainCommandInput,
  GetPrimaryDomainCommandOutput,
} from './get-primary-domain-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class GetPrimaryDomainCommand extends CcApiSimpleCommand<
  GetPrimaryDomainCommandInput,
  GetPrimaryDomainCommandOutput
> {
  toRequestParams(params: GetPrimaryDomainCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/favourite`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetPrimaryDomainCommandOutput {
    return transformDomain(response, true);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
