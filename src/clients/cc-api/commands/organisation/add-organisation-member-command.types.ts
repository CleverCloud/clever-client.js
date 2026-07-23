import type { OrganisationMemberRole } from './organisation.types.js';

export interface AddOrganisationMemberCommandInput {
  organisationId: string;
  role: OrganisationMemberRole;
  emailAddress: string;
  jobTitle?: string;
  invitationKey?: string;
}
