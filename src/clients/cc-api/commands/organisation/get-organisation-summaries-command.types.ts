import type { OrganisationSummary } from './organisation.types.js';

// transformed: the personal organisation first, the others sorted by name
export type GetOrganisationSummariesCommandOutput = Array<OrganisationSummary>;
