import type { OauthConsumerRights } from './oauth-consumer-rights.js';

export type { AccessRights, GrantableRights, ManageRights, OauthConsumerRights } from './oauth-consumer-rights.js';

/**
 * A third party application allowed to act on Clever Cloud on a user's behalf through OAuth, along
 * with the rights the user granted it.
 */
export interface OauthConsumer {
  /** Display name shown on the consent screen. */
  name: string;
  /** Description shown on the consent screen. */
  description: string;
  /** OAuth consumer key, which also identifies the consumer in the API. */
  key: string;
  /** URL of the application's home page. */
  url: string;
  /** URL of the logo shown on the consent screen. */
  picture: string;
  /** URL the OAuth callbacks are sent to. */
  baseUrl: string;
  /** Which rights the consumer holds, keyed by right. */
  rights: Record<OauthConsumerRights, boolean>;
  /** OAuth consumer secret. Only filled when it was explicitly asked for. */
  secret?: string;
}
