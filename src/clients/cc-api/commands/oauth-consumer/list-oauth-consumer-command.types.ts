import type { OauthConsumer } from './oauth-consumer.types.js';

export interface ListOauthConsumerCommandInput {
  ownerId: string;
  withSecret: boolean;
}

// transformed: sorted by name
export type ListOauthConsumerCommandOutput = Array<OauthConsumer>;
