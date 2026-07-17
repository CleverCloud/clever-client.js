import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { guessPrimaryDomain } from '../../../../utils/domain-utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ApplicationId, CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformDomain } from './domain-transform.js';
import type { Domain } from './domain.types.js';
import type { ListDomainCommandInput, ListDomainCommandOutput } from './list-domain-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class ListDomainCommand extends CcApiCompositeCommand<ListDomainCommandInput, ListDomainCommandOutput> {
  async compose(params: ListDomainCommandInput, composer: CcApiComposer): Promise<ListDomainCommandOutput> {
    const [rawDomains, primaryDomain] = await Promise.all([
      composer.send(new ListDomainInnerCommand(params)),
      composer.send(new GetPrimaryDomainInnerCommand(params)),
    ]);

    const domains = rawDomains.map((domain) => ({
      ...domain,
      isPrimary: domain.domain === primaryDomain?.domain,
    }));

    // if a primary domain is there, nothing to do, otherwise guess one (see @domain-utils.ts)
    if (!domains.some((domain) => domain.isPrimary)) {
      const fallbackPrimary = guessPrimaryDomain(domains.map((domain) => domain.domain));
      const fallbackDomain = domains.find((domain) => domain.domain === fallbackPrimary);
      if (fallbackDomain != null) {
        fallbackDomain.isPrimary = true;
      }
    }

    return domains;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts
 * @group Domain
 * @version 2
 */
class ListDomainInnerCommand extends CcApiSimpleCommand<ListDomainCommandInput, Array<Domain>> {
  toRequestParams(params: ListDomainCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts`);
  }

  transformCommandOutput(response: unknown): Array<Domain> {
    return sortBy(
      (response as Array<unknown>).map((domain) => transformDomain(domain)),
      'domain',
    );
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
class GetPrimaryDomainInnerCommand extends CcApiSimpleCommand<ApplicationId, Domain> {
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
}
