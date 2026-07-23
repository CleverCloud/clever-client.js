import type { OrganisationMember } from './organisation.types.js';

export interface ListOrganisationMemberCommandInput {
  organisationId: string;
}

// transformed: sorted by name, then emailAddress, then id
export type ListOrganisationMemberCommandOutput = Array<OrganisationMember>;
