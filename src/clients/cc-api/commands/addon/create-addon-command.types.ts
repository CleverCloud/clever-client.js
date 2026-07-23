import type { Addon } from './addon.types.js';

/**
 * Description of the add-on to provision.
 */
export interface CreateAddonCommandInput {
  /** Identifier of the organisation the add-on will belong to. */
  ownerId: string;
  /** Display name to give to the add-on. */
  name: string;
  /**
   * Name of the zone to provision the add-on in.
   * @renamedFrom `region`
   */
  zone: string;
  /** Identifier of the add-on provider to provision from, for example `postgresql-addon`. */
  providerId: string;
  /** Identifier of the provider plan to subscribe to. */
  planId: string;
  /** Provider specific provisioning options, for example the engine version. Defaults to an empty map. */
  options?: Record<string, string>;
}

/**
 * The freshly provisioned add-on.
 */
export type CreateAddonCommandOutput = Addon;
