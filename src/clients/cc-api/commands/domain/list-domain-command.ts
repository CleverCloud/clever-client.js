import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { tolerateNotFound } from '../../../../utils/error-utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformDomain } from './domain-transform.js';
import type { Domain } from './domain.types.js';
import { GetPrimaryDomainCommand } from './get-primary-domain-command.js';
import type { ListDomainCommandInput, ListDomainCommandOutput } from './list-domain-command.types.js';

/**
 * Lists the domains an application answers on, with the primary one flagged.
 *
 * The favourite domain is fetched alongside the list. If no primary domain can be found, you can guess one
 * using `@clevercloud/client/utils/domain-utils.js`.
 *
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class ListDomainCommand extends CcApiCompositeCommand<ListDomainCommandInput, ListDomainCommandOutput> {
  async compose(params: ListDomainCommandInput, composer: CcApiComposer): Promise<ListDomainCommandOutput> {
    const [rawDomains, primaryDomain] = await Promise.all([
      composer.send(new ListDomainInnerCommand(params)),
      tolerateNotFound(composer.send(new GetPrimaryDomainCommand(params))),
    ]);

    const domains = rawDomains.map((domain) => ({
      ...domain,
      isPrimary: domain.domain === primaryDomain?.domain,
    }));

    return domains;
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

/**
 * Lists the raw domains of an application, before the primary one is resolved.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}
