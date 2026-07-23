import { QueryParams } from '../../../../lib/request/query-params.js';
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { AddOrganisationMemberCommandInput } from './add-organisation-member-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `UNAUTHORISED_ADDITION`: the current user is not allowed to add a member to this organisation
 * - `UNAUTHORISED_ROLE_ASSIGNMENT`: the current user is not allowed to assign this role
 */
export const ADD_ORGANISATION_MEMBER_ERROR_CODES = {
  UNAUTHORISED_ADDITION: 'clever.organisation.member.unauthorised-addition',
  UNAUTHORISED_ROLE_ASSIGNMENT: 'clever.organisation.member.unauthorised-role-assignment',
} as const;

export type AddOrganisationMemberErrorCode =
  (typeof ADD_ORGANISATION_MEMBER_ERROR_CODES)[keyof typeof ADD_ORGANISATION_MEMBER_ERROR_CODES];

const API_ERROR_CODES: Record<string, AddOrganisationMemberErrorCode> = {
  '6451': ADD_ORGANISATION_MEMBER_ERROR_CODES.UNAUTHORISED_ADDITION,
  '6453': ADD_ORGANISATION_MEMBER_ERROR_CODES.UNAUTHORISED_ROLE_ASSIGNMENT,
};

/**
 * Adds a member to an organisation, or accepts a pending invitation to one.
 *
 * Without an invitation key, an invitation email is sent to the given address and the member only
 * joins once they follow it; the current user must be allowed to add members and to assign the
 * requested role. With an invitation key, the current user joins the organisation the invitation
 * was issued for, and the other parameters are ignored.
 *
 * Common error codes: see {@link ADD_ORGANISATION_MEMBER_ERROR_CODES}
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
        email: params.emailAddress,
        job: params.jobTitle,
      },
      new QueryParams().set('invitationKey', params.invitationKey),
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }
}
