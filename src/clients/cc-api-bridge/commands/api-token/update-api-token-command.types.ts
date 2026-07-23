/**
 * Identifies the API token to update, along with its new label. The expiry date and the token value
 * cannot be changed.
 */
export interface UpdateApiTokenCommandInput {
  /** Identifier of the token. */
  apiTokenId: string;
  /** New display name of the token. */
  name: string;
  /**
   * New free text note about what the token is for. The whole label is replaced, so leaving this
   * out clears the note the token already had.
   */
  description?: string;
}
