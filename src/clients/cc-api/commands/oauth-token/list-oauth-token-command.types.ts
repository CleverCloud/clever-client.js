import type { OauthConsumer, OauthConsumerRights } from '../oauth-consumer/oauth-consumer.types.js';

// transformed: sorted by createdAt, most recent first
export type ListTokenCommandOutput = Array<OauthToken>;

export interface OauthToken {
  token: string;
  consumer: OauthConsumer;
  // renamed from creationDate
  // transformed: converted to an ISO date string
  createdAt: string;
  // renamed from expirationDate
  // transformed: converted to an ISO date string
  expiresAt: string;
  // renamed from lastUtilisation
  // transformed: converted to an ISO date string
  lastUsedAt: string;
  rights: Record<OauthConsumerRights, boolean>;
  employeeId?: string;
}
