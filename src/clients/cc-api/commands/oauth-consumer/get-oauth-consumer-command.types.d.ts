import { type OauthConsumer } from './oauth-consumer.types.js';

export interface GetOauthConsumerCommandInput {
  ownerId?: string;
  oauthConsumerKey: string;
  withSecret: boolean;
}

export type GetOauthConsumerCommandOutput = OauthConsumer;
