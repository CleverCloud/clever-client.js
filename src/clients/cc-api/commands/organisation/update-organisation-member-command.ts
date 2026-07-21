import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { UpdateOrganisationMemberCommandInput } from './update-organisation-member-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `NOT_FOUND`: the member is not part of the organisation
 * - `UNAUTHORISED_ADDITION`: the current user is not allowed to edit the members of this organisation
 * - `UNAUTHORISED_ROLE_ASSIGNMENT`: the current user is not allowed to assign the old or the new role
 */
export const UPDATE_ORGANISATION_MEMBER_ERROR_CODES = {
  NOT_FOUND: 'clever.organisation.member.not-found',
  UNAUTHORISED_ADDITION: 'clever.organisation.member.unauthorised-addition',
  UNAUTHORISED_ROLE_ASSIGNMENT: 'clever.organisation.member.unauthorised-role-assignment',
} as const;

export type UpdateOrganisationMemberErrorCode =
  (typeof UPDATE_ORGANISATION_MEMBER_ERROR_CODES)[keyof typeof UPDATE_ORGANISATION_MEMBER_ERROR_CODES];

const API_ERROR_CODES: Record<string, UpdateOrganisationMemberErrorCode> = {
  '6451': UPDATE_ORGANISATION_MEMBER_ERROR_CODES.UNAUTHORISED_ADDITION,
  '6453': UPDATE_ORGANISATION_MEMBER_ERROR_CODES.UNAUTHORISED_ROLE_ASSIGNMENT,
  '6501': UPDATE_ORGANISATION_MEMBER_ERROR_CODES.NOT_FOUND,
};

/**
 * Updates the role or the job title of an organisation member.
 *
 * Common error codes: see {@link UPDATE_ORGANISATION_MEMBER_ERROR_CODES}
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

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }
}
