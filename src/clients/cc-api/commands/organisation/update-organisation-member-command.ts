import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { UpdateOrganisationMemberCommandInput } from './update-organisation-member-command.types.js';

/**
 * Updates the role or the job title of an organisation member.
 *
 * Common error codes:
 * - `clever.organisation.member.not-found`: the member is not part of the organisation
 * - `clever.organisation.member.unauthorised-addition`: the current user is not allowed to edit the members of this organisation
 * - `clever.organisation.member.unauthorised-role-assignment`: the current user is not allowed to assign the old or the new role
 *
 * @endpoint [PUT] /v2/organisations/:XXX/members/:XXX
 * @group Organisation
 * @version 2
 */
export class UpdateOrganisationMemberCommand extends CcApiSimpleCommand<
  UpdateOrganisationMemberCommandInput,
  undefined
> {
  toRequestParams(params: UpdateOrganisationMemberCommandInput) {
    return put(safeUrl`/v2/organisations/${params.organisationId}/members/${params.memberId}`, {
      role: params.role,
      job: params.job,
    });
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
    if (errorCode === '6501') {
      return 'clever.organisation.member.not-found';
    }
    return errorCode;
  }
}
