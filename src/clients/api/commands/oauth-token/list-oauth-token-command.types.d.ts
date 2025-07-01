import type { OauthConsumer, OauthConsumerRights } from '../oauth-consumer/oauth-consumer.types.js';

export type ListTokenCommandOutput = Array<OauthToken>;

export interface OauthToken {
  token: string;
  consumer: OauthConsumer;
  // converted to iso
  creationDate: string;
  // converted to iso
  expirationDate: string;
  // renamed from lastUtilisation and converted to iso
  lastUtilisationDate: string;
  rights: Record<OauthConsumerRights, boolean>;
  employeeId?: string;
}
