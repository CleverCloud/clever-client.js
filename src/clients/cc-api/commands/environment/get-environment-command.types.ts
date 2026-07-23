import type { AddonId, ApplicationId } from '../../types/cc-api.types.js';

/**
 * Which resource's environment to read: an application, which may also pull in what it is linked
 * to, or an add-on.
 */
export type GetEnvironmentCommandInput = GetEnvironmentCommandInputApplication | GetEnvironmentCommandInputAddon;

/**
 * Reads an application's environment, optionally with what its links contribute.
 */
export interface GetEnvironmentCommandInputApplication extends ApplicationId {
  /** Whether to also read the variables exposed by the linked applications. Costs one extra request. */
  includeLinkedApplications?: boolean;
  /** Whether to also read the variables exposed by the linked add-ons. Costs one extra request. */
  includeLinkedAddons?: boolean;
}

/**
 * Reads an add-on's environment, that is the connection details it exposes.
 */
export type GetEnvironmentCommandInputAddon = AddonId;

/**
 * Identifies the application whose own variables are read.
 *
 * @internal
 */
export type GetApplicationEnvironmentCommandInput = ApplicationId;

/**
 * Identifies the add-on whose exposed variables are read.
 *
 * @internal
 */
export type GetAddonEnvironmentCommandInput = AddonId;

/**
 * Identifies the application whose linked applications' variables are read.
 *
 * @internal
 */
export type GetLinkedApplicationEnvironmentCommandInput = ApplicationId;

/**
 * Identifies the application whose linked add-ons' variables are read.
 *
 * @internal
 */
export type GetLinkedAddonEnvironmentCommandInput = ApplicationId;
