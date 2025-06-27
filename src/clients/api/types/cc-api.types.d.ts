import type { CompositeCommand, SimpleCommand } from '../../../lib/command/command.js';
import type { OauthTokens } from '../../../types/auth.types.js';
import type { CcClientConfig } from '../../../types/client.types.js';
import type { Composer } from '../../../types/command.types.js';
import type { WithOptional } from '../../../types/utils.types.js';
import type { ResourceIdIndex, Store } from './resource-id-resolver.types.js';

export type CcApiType = 'api';

export interface CcApiClientConfig extends WithOptional<CcClientConfig, 'baseUrl'> {
  resourceIdResolverStore?: Store<ResourceIdIndex>;
  authMethod?: CcApiAuth;
}

export type CcApiAuth = CcApiAuthWithApiToken | CcApiAuthWithOauthV1PlainText;

export interface CcApiAuthWithApiToken {
  type: 'api-token';
  apiToken: string;
}

export interface CcApiAuthWithOauthV1PlainText {
  type: 'oauth-v1-plaintext';
  oauthTokens: OauthTokens;
}

export type CcApiCommand<CommandInput, CommandOutput> =
  | SimpleCommand<CcApiType, CommandInput, CommandOutput>
  | CompositeCommand<CcApiType, CommandInput, CommandOutput>;

export type CcApiComposer = Composer<CcApiType>;

export type MaybeWithOwnerId<T> = T & { ownerId?: string };
export type ApplicationOrAddonId = ApplicationId | AddonId;
export type ResourceId = ApplicationId | AddonId | AddonProviderId | OauthConsumerKey;
export type ApplicationId = MaybeWithOwnerId<{ applicationId: string }>;
export type AddonId = MaybeWithOwnerId<{ addonId: string }>;
export type AddonProviderId = MaybeWithOwnerId<{ addonProviderId: string }>;
export type OauthConsumerKey = MaybeWithOwnerId<{ oauthConsumerKey: string }>;
export type WithOwnerId<T> = T & { ownerId: string };
