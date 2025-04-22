import type { AddonId, ApplicationId, ApplicationOrAddonId, WithOwnerId } from '../../types/cc-api.types.js';

export type GetEnvironmentCommandInput = ApplicationOrAddonId & {
  includeLinkedApplications?: boolean;
  includeLinkedAddons?: boolean;
};
export type GetApplicationEnvironmentCommandInput = WithOwnerId<ApplicationId>;
export type GetAddonEnvironmentCommandInput = WithOwnerId<AddonId>;
export type GetLinkedApplicationEnvironmentCommandInput = WithOwnerId<ApplicationId>;
export type GetLinkedAddonEnvironmentCommandInput = WithOwnerId<ApplicationId>;
