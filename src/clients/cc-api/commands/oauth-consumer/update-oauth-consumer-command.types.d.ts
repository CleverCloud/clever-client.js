import { AccessRights, ManageRights, OauthConsumer } from './oauth-consumer.types.js';

export interface UpdateOauthConsumerCommandInput {
  ownerId?: string;
  oauthConsumerKey: string;
  name: string;
  description: string;
  url: string;
  picture: string;
  baseUrl: string;
  rights: Record<AccessRights | ManageRights, boolean>;
}

export type UpdateOauthConsumerCommandOutput = OauthConsumer;
