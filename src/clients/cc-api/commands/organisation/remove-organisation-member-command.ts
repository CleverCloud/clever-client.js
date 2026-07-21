import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { RemoveOrganisationMemberCommandInput } from './remove-organisation-member-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `NOT_FOUND`: the member is not part of the organisation
 * - `UNAUTHORISED_DELETION`: the current user is not allowed to remove this member
 */
export const REMOVE_ORGANISATION_MEMBER_ERROR_CODES = {
  NOT_FOUND: 'clever.organisation.member.not-found',
  UNAUTHORISED_DELETION: 'clever.organisation.member.unauthorised-deletion',
} as const;

export type RemoveOrganisationMemberErrorCode =
  (typeof REMOVE_ORGANISATION_MEMBER_ERROR_CODES)[keyof typeof REMOVE_ORGANISATION_MEMBER_ERROR_CODES];

const API_ERROR_CODES: Record<string, RemoveOrganisationMemberErrorCode> = {
  '6452': REMOVE_ORGANISATION_MEMBER_ERROR_CODES.UNAUTHORISED_DELETION,
  '6501': REMOVE_ORGANISATION_MEMBER_ERROR_CODES.NOT_FOUND,
};

/**
 * Removes a member from an organisation.
 *
 * Common error codes: see {@link REMOVE_ORGANISATION_MEMBER_ERROR_CODES}
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
    return API_ERROR_CODES[errorCode] ?? errorCode;
  }
}
