/**
 * Identifies the member to remove from an organisation.
 */
export interface RemoveOrganisationMemberCommandInput {
  /** Identifier of the organisation to remove the member from. */
  organisationId: string;
  /** Identifier of the user to remove, of the form `user_<uuid>`. */
  memberId: string;
}
