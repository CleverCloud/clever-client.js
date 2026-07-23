import type { OrganisationMemberRole } from './organisation.types.js';

/**
 * Describes which member of an organisation to update, and with what.
 */
export interface UpdateOrganisationMemberCommandInput {
  /** Identifier of the organisation the member belongs to. */
  organisationId: string;
  /** Identifier of the user to update, of the form `user_<uuid>`. */
  memberId: string;
  /**
   * New role of the member.
   * @sentAs `role`
   */
  role?: OrganisationMemberRole;
  /**
   * New job title of the member within the organisation.
   * @sentAs `job`
   */
  jobTitle?: string;
}
