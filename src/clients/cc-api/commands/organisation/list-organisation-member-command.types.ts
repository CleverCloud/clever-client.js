import type { OrganisationMember } from './organisation.types.js';

/**
 * Identifies the organisation whose members are listed.
 */
export interface ListOrganisationMemberCommandInput {
  /** Identifier of the organisation whose members are listed. */
  organisationId: string;
}

/**
 * The members of the organisation. Sorted by name, then email address, then id.
 */
export type ListOrganisationMemberCommandOutput = Array<OrganisationMember>;
