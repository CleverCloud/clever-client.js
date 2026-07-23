import type { AccessRights, ManageRights, OauthConsumer } from './oauth-consumer.types.js';

/**
 * Description of the OAuth consumer to register.
 */
export interface CreateOauthConsumerCommandInput {
  /** Identifier of the organisation that will own the consumer. */
  ownerId: string;
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
 * The freshly registered consumer, without its secret.
 */
export type CreateOauthConsumerCommandOutput = OauthConsumer;
