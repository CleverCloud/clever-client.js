import { get } from '../../../../lib/request/request-params-builder.ts';
import { sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { ListOrganisationCommandInput, ListOrganisationCommandOutput } from './list-organisation-command.types.ts';
import { transformOrganisation } from './organisation-transform.ts';

/**
 * Lists the organisations the current user is a member of.
 *
 * The endpoint also returns the personal organisation of the user, which is filtered out unless
 * `withPersonalOrganisation` is set.
 *
 * @endpoint [GET] /v2/organisations
 * @group Organisation
 * @version 2
 */
export class ListOrganisationCommand extends CcApiSimpleCommand<
  ListOrganisationCommandInput,
  ListOrganisationCommandOutput
> {
  toRequestParams() {
    return get(`/v2/organisations`);
  }

  transformCommandOutput(response: unknown): ListOrganisationCommandOutput {
    return sortBy(
      (response as Array<{ id: string }>)
        .filter((r) => this.params.withPersonalOrganisation || r.id.startsWith('orga_'))
        .map(transformOrganisation),
      'name',
      'id',
    );
  }

  isIdempotent(): boolean {
    return true;
  }
}
