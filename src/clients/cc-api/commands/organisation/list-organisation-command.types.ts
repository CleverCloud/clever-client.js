import type { Organisation } from './organisation.types.js';

export interface ListOrganisationCommandInput {
  withPersonalOrganisation: boolean;
}

// transformed: sorted by name, then id
export type ListOrganisationCommandOutput = Array<Organisation>;
