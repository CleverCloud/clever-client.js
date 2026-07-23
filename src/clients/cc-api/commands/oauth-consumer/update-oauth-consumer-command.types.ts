import type { AccessRights, ManageRights, OauthConsumer } from './oauth-consumer.types.js';

/**
 * Identifies the OAuth consumer to replace, along with its new definition.
 */
export interface UpdateOauthConsumerCommandInput {
  /** Identifier of the owning organisation. Resolved automatically when omitted. */
  ownerId?: string;
  /** OAuth consumer key identifying the consumer. */
  oauthConsumerKey: string;
  /** Display name shown on the consent screen. */
  name: string;
  /** Description shown on the consent screen. */
  description: string;
  /** URL of the application's home page. */
  url: string;
  /** URL of the logo shown on the consent screen. */
  picture: string;
  /** URL the OAuth callbacks are sent to. */
  baseUrl: string;
  /**
   * Rights to grant the consumer, keyed by right.
   * @converted to the API's snake_case keys
   */
  rights: Record<AccessRights | ManageRights, boolean>;
}

/**
 * The consumer as it stands after the update.
 */
export type UpdateOauthConsumerCommandOutput = OauthConsumer;
