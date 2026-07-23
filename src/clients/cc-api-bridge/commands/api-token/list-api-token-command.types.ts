import type { ApiToken } from './api-token.types.js';

/**
 * The API tokens of the current user, in the order the API returned them. Token values are never
 * part of this listing.
 */
export type ListApiTokenCommandOutput = Array<ApiToken>;
