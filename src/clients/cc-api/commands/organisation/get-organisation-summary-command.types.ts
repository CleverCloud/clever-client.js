import type { OrganisationSummary, UserSummary } from './organisation.types.js';

/**
 * The signed-in user and every organisation they have access to, with the products each one holds.
 */
export interface GetOrganisationSummaryCommandOutput {
  /** The signed-in user. */
  user: UserSummary;
  /**
   * Organisations the user has access to. The personal organisation comes first, the other
   * organisations follow sorted by name.
   */
  organisations: Array<OrganisationSummary>;
}
