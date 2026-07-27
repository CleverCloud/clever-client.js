/**
 * Identifies the API token to update, along with its new label. The expiry date and the token value
 * cannot be changed.
 *
 * This is a full replace, not a partial update: the backend rewrites the token's label from the
 * fields sent here, so both `name` and `description` are required and must carry the values the
 * token should keep. Anything left out is not preserved.
 */
export interface UpdateApiTokenCommandInput {
  /** Identifier of the token. */
  apiTokenId: string;
  /** New display name of the token. Must be a non-empty string; the backend rejects an empty name. */
  name: string;
  /**
   * New free text note about what the token is for. The whole label is replaced, so this must be
   * set to the note the token should keep; passing an empty string (or leaving it unset) clears the
   * note the token already had.
   */
  description: string;
}
