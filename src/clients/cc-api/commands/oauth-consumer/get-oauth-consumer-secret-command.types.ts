/**
 * Identifies the OAuth consumer whose secret is read.
 */
export interface GetOauthConsumerSecretCommandInput {
  /** Identifier of the owning organisation. Resolved automatically when omitted. */
  ownerId?: string;
  /** OAuth consumer key identifying the consumer. */
  oauthConsumerKey: string;
}

/**
 * The consumer secret.
 */
export interface GetOauthConsumerSecretCommandOutput {
  /** OAuth consumer secret, used to sign the OAuth requests. */
  secret: string;
}
