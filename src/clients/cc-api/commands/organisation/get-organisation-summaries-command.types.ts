import type { OrganisationSummary } from './organisation.types.js';

/**
 * Every owner the current user has access to, with the products it holds. The personal organisation
 * comes first, the other organisations follow sorted by name.
 */
export type GetOrganisationSummariesCommandOutput = Array<OrganisationSummary>;
