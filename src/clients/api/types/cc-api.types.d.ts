import type { OAuthTokens } from '../../../types/auth.types.js';
import type { CcClientConfig } from '../../../types/client.types.js';
import type { Composer } from '../../../types/command.types.js';
import type { WithOptional } from '../../../types/utils.types.js';
import type { OwnerIdIndexStore } from '../lib/owner-id-resolver.types.js';

export type CcApiType = 'api';

export interface CcApiClientConfig extends WithOptional<CcClientConfig, 'baseUrl'> {
  ownerIdResolverStore?: OwnerIdIndexStore;
}

export interface CcApiClientConfigWithOAuth extends CcApiClientConfig {
  oAuthTokens: OAuthTokens;
}

export interface CcApiClientConfigWithApiToken extends CcApiClientConfig {
  apiToken: string;
}

export type CcApiComposeClient = Composer<CcApiType>;

export type MaybeWithOwnerId<T> = T & { ownerId?: string };
export type ApplicationOrAddonId = ApplicationId | AddonId;
export type ApplicationId = MaybeWithOwnerId<{ applicationId: string }>;
export type AddonId = MaybeWithOwnerId<{ addonId: string }>;
export type WithOwnerId<T> = T & { ownerId: string };
