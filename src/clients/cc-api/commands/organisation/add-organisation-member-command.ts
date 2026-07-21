import { QueryParams } from '../../../../lib/request/query-params.js';
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { AddOrganisationMemberCommandInput } from './add-organisation-member-command.types.js';

/**
 * Adds a member to an organisation.
 *
 * Common error codes:
 * - `clever.organisation.member.unauthorised-addition`: the current user is not allowed to add a member to this organisation
 * - `clever.organisation.member.unauthorised-role-assignment`: the current user is not allowed to assign this role
 *
 * @endpoint [POST] /v2/organisations/:XXX/members
 * @group Organisation
 * @version 2
 */
export class AddOrganisationMemberCommand extends CcApiSimpleCommand<AddOrganisationMemberCommandInput, undefined> {
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

  transformCommandOutput(): undefined {
    return undefined;
  }

  transformErrorCode(errorCode: string) {
    if (errorCode === '6451') {
      return 'clever.organisation.member.unauthorised-addition';
    }
    if (errorCode === '6453') {
      return 'clever.organisation.member.unauthorised-role-assignment';
    }
    return errorCode;
  }
}
