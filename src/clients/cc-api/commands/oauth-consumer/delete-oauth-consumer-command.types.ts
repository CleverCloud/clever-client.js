/**
 * Identifies the OAuth consumer to remove.
 */
export interface DeleteOauthConsumerCommandInput {
  /** Identifier of the owning organisation. Resolved automatically when omitted. */
  ownerId?: string;
  /** OAuth consumer key identifying the consumer. */
  oauthConsumerKey: string;
}
