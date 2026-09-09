import type { OauthConsumer } from './oauth-consumer.types.js';

/**
 * Identifies the organisation whose OAuth consumers are listed, and how much of each to fetch.
 */
export interface ListOauthConsumerCommandInput {
  /** Identifier of the organisation owning the consumers. */
  ownerId: string;
  /** Whether to also fetch each consumer's secret. Costs one extra request per consumer. */
  withSecret: boolean;
}

/**
 * The consumers, sorted by name. Their `secret` is only filled when `withSecret` was set.
 */
export type ListOauthConsumerCommandOutput = Array<OauthConsumer>;
