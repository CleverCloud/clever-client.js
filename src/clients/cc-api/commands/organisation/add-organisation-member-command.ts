import { QueryParams } from '../../../../lib/request/query-params.js';
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { AddOrganisationMemberCommandInput } from './add-organisation-member-command.types.js';

/**
 * @endpoint [POST] /v2/organisations/:XXX/members
 * @group Organisation
 * @version 2
 */
export class AddOrganisationMemberCommand extends CcApiSimpleCommand<AddOrganisationMemberCommandInput, void> {
  toRequestParams(params: AddOrganisationMemberCommandInput) {
    return post(
      safeUrl`/v2/organisations/${params.organisationId}/members`,
      {
        role: params.role,
        email: params.email,
        job: params.job,
      },
      new QueryParams().set('invitationKey', params.invitationKey),
    );
  }

  transformCommandOutput(): void {
    return null;
  }
}
