import type { OauthConsumer } from './oauth-consumer.types.js';

/**
 * Identifies the OAuth consumer to retrieve, and how much of it to fetch.
 */
export interface GetOauthConsumerCommandInput {
  /** Identifier of the owning organisation. Resolved automatically when omitted. */
  ownerId?: string;
  /** OAuth consumer key identifying the consumer. */
  oauthConsumerKey: string;
  /** Whether to also fetch the consumer secret. Costs one extra request. */
  withSecret: boolean;
}

/**
 * The requested consumer. Its `secret` is only filled when `withSecret` was set.
 */
export type GetOauthConsumerCommandOutput = OauthConsumer;
