import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { RemoveOrganisationMemberCommandInput } from './remove-organisation-member-command.types.js';

/**
 * Removes a member from an organisation.
 *
 * Common error codes:
 * - `clever.organisation.member.not-found`: the member is not part of the organisation
 * - `clever.organisation.member.unauthorised-deletion`: the current user is not allowed to remove this member
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/members/:XXX
 * @group Organisation
 * @version 2
 */
export class RemoveOrganisationMemberCommand extends CcApiSimpleCommand<
  RemoveOrganisationMemberCommandInput,
  undefined
> {
  toRequestParams(params: RemoveOrganisationMemberCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.organisationId}/members/${params.memberId}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  transformErrorCode(errorCode: string) {
    if (errorCode === '6452') {
      return 'clever.organisation.member.unauthorised-deletion';
    }
    if (errorCode === '6501') {
      return 'clever.organisation.member.not-found';
    }
    return errorCode;
  }
}
