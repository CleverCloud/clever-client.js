import type { OrganisationMemberRole } from './organisation.types.js';

export interface UpdateOrganisationMemberCommandInput {
  organisationId: string;
  memberId: string;
  role?: OrganisationMemberRole;
  job?: string;
}

export interface UpdateOrganisationMemberCommandOutput {}
