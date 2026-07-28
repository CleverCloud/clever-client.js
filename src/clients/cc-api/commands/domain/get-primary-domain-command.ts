import { CcApiCompositeCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetPrimaryDomainCommandInput,
  GetPrimaryDomainCommandOutput,
} from './get-primary-domain-command.types.js';
import { ListDomainCommand } from './list-domain-command.js';

/**
 * Returns the application's primary domain. It relies on {@link ListDomainCommand}, so when no
 * favourite domain is set on the application, the primary domain is guessed (see `@domain-utils.ts`).
 *
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class GetPrimaryDomainCommand extends CcApiCompositeCommand<
  GetPrimaryDomainCommandInput,
  GetPrimaryDomainCommandOutput
> {
  async compose(params: GetPrimaryDomainCommandInput, composer: CcApiComposer): Promise<GetPrimaryDomainCommandOutput> {
    const domains = await composer.send(new ListDomainCommand(params));
    return domains.find((domain) => domain.isPrimary);
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
