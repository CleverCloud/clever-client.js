import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  ListOrganisationMemberCommandInput,
  ListOrganisationMemberCommandOutput,
} from './list-organisation-member-command.types.ts';
import { transformOrganisationMember } from './organisation-transform.ts';

/**
 * Lists the members of an organisation, with their role.
 *
 * @endpoint [GET] /v2/organisations/:XXX/members
 * @group Organisation
 * @version 2
 */
export class ListOrganisationMemberCommand extends CcApiSimpleCommand<
  ListOrganisationMemberCommandInput,
  ListOrganisationMemberCommandOutput
> {
  toRequestParams(params: ListOrganisationMemberCommandInput) {
    return get(safeUrl`/v2/organisations/${params.organisationId}/members`);
  }

  transformCommandOutput(response: unknown): ListOrganisationMemberCommandOutput {
    return sortBy((response as Array<unknown>).map(transformOrganisationMember), 'name', 'emailAddress', 'id');
  }

  isIdempotent(): boolean {
    return true;
  }
}
