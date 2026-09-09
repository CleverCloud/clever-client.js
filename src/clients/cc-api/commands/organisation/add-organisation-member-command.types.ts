import type { OrganisationMemberRole } from './organisation.types.js';

/**
 * Describes the member to add to an organisation, or the invitation to accept.
 */
export interface AddOrganisationMemberCommandInput {
  /** Identifier of the organisation to add the member to. */
  organisationId: string;
  /**
   * Role to give the new member.
   * @sentAs `role`
   */
  role: OrganisationMemberRole;
  /**
   * Email address the invitation is sent to.
   * @sentAs `email`
   */
  emailAddress: string;
  /**
   * Free text job title of the new member within the organisation.
   * @sentAs `job`
   */
  jobTitle?: string;
  /**
   * Key of a pending invitation, taken from the invitation link. When given, the current user joins
   * the organisation with the role that invitation carries, and the other parameters are ignored.
   */
  invitationKey?: string;
}
