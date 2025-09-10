import { OauthConsumer } from './oauth-consumer.types.js';

export interface ListOauthConsumerCommandInput {
  ownerId: string;
  withSecret: boolean;
}

export type ListOauthConsumerCommandOutput = Array<OauthConsumer>;
