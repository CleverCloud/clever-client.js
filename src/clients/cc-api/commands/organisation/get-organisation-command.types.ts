import type { Organisation } from './organisation.types.js';

/**
 * Identifies the organisation to retrieve.
 */
export interface GetOrganisationCommandInput {
  /** Identifier of the organisation to retrieve. */
  organisationId: string;
}

/**
 * The organisation, with its display and billing identity.
 */
export type GetOrganisationCommandOutput = Organisation;
