import type { ComposeClient } from '../../common/types/command.types.js';
import type { CcApiClient } from '../cc-api-client.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../common/cc-api-commands.js';

export type CcApiCommand<ResponseBody> = CcApiSimpleCommand<ResponseBody> | CcApiCompositeCommand<ResponseBody>;

export type CcApiComposeClient = ComposeClient<CcApiClient>;

export type MaybeWithOwnerId<T> = T & { ownerId?: string };
export type ApplicationOrAddonId = ApplicationId | AddonId;
export type ApplicationId = MaybeWithOwnerId<{ applicationId: string }>;
export type AddonId = MaybeWithOwnerId<{ addonId: string }>;
export type WithOwnerId<T> = T & { ownerId: string };
