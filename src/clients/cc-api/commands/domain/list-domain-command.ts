import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformDomain } from './domain-transform.js';
import type { Domain } from './domain.types.js';
import { GetPrimaryDomainCommand } from './get-primary-domain-command.js';
import type { ListDomainCommandInput, ListDomainCommandOutput } from './list-domain-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts
 * @group Domain
 * @version 2
 */
export class ListDomainCommand extends CcApiCompositeCommand<ListDomainCommandInput, ListDomainCommandOutput> {
  async compose(params: ListDomainCommandInput, composer: CcApiComposer): Promise<ListDomainCommandOutput> {
    return Promise.all([
      composer.send(new ListDomainInnerCommand(params)),
      composer.send(new GetPrimaryDomainCommand(params)),
    ]).then(([domains, primaryDomain]) =>
      domains.map((domain) => ({
        ...domain,
        isPrimary: domain.domain === primaryDomain?.domain,
      })),
    );
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

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
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
