import type { OauthConsumer, OauthConsumerRights } from '../oauth-consumer/oauth-consumer.types.js';

/**
 * The user's OAuth tokens, sorted by creation date, most recent first.
 */
export type ListTokenCommandOutput = Array<OauthToken>;

/**
 * An OAuth token issued to a consumer on the user's behalf, and what it is allowed to do.
 */
export interface OauthToken {
  /** The token value, which also identifies it. */
  token: string;
  /** The consumer the token was issued to. */
  consumer: OauthConsumer;
  /**
   * When the token was issued.
   * @renamedFrom `creationDate`
   * @converted to an ISO date string
   */
  createdAt: string;
  /**
   * When the token stops being accepted.
   * @renamedFrom `expirationDate`
   * @converted to an ISO date string
   */
  expiresAt: string;
  /**
   * When the token was last used.
   * @renamedFrom `lastUtilisation`
   * @converted to an ISO date string
   */
  lastUsedAt: string;
  /** Which rights this token actually holds, keyed by right. May be narrower than the consumer's. */
  rights: Record<OauthConsumerRights, boolean>;
  /** Identifier of the Clever Cloud employee acting on the account, on a support impersonation token. */
  employeeId?: string;
}
