import type { OrganisationMemberRole } from './organisation.types.js';

export interface AddOrganisationMemberCommandInput {
  organisationId: string;
  role: OrganisationMemberRole;
  email: string;
  job?: string;
  invitationKey?: string;
}
