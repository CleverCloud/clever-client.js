import { OrganisationMember } from './organisation.types.js';

export interface ListOrganisationMemberCommandInput {
  organisationId: string;
}

export type ListOrganisationMemberCommandOutput = Array<OrganisationMember>;
