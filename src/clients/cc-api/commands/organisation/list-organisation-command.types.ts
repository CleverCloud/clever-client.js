import type { Organisation } from './organisation.types.js';

/**
 * Narrows down which organisations of the current user are listed.
 */
export interface ListOrganisationCommandInput {
  /**
   * Whether the personal organisation of the current user is kept. When `false`, only the
   * organisations whose id starts with `orga_` are returned.
   */
  withPersonalOrganisation: boolean;
}

/**
 * The organisations the current user is a member of. Sorted by name, then id.
 */
export type ListOrganisationCommandOutput = Array<Organisation>;
