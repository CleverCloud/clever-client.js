export interface GetOauthConsumerSecretCommandInput {
  ownerId?: string;
  oauthConsumerKey: string;
}

export interface GetOauthConsumerSecretCommandOutput {
  secret: string;
}
