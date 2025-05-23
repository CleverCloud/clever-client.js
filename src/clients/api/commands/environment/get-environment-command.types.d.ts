import type { AddonId, ApplicationId } from '../../types/cc-api.types.js';

export type GetEnvironmentCommandInput = GetEnvironmentCommandInputApplication | GetEnvironmentCommandInputAddon;

export interface GetEnvironmentCommandInputApplication extends ApplicationId {
  includeLinkedApplications?: boolean;
  includeLinkedAddons?: boolean;
}

export type GetEnvironmentCommandInputAddon = AddonId;

export type GetApplicationEnvironmentCommandInput = ApplicationId;
export type GetAddonEnvironmentCommandInput = AddonId;
export type GetLinkedApplicationEnvironmentCommandInput = ApplicationId;
export type GetLinkedAddonEnvironmentCommandInput = ApplicationId;
