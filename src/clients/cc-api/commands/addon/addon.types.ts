import type { AddonProvider, AddonProviderPlan } from '../addon-provider/addon-provider.types.js';

/**
 * An add-on provisioned in an organisation: a managed service (database, storage, monitoring, ...)
 * that applications consume through the environment variables it exposes.
 */
export interface Addon {
  /** Public identifier of the add-on, of the form `addon_<uuid>`. */
  id: string;
  /** Display name of the add-on. */
  name: string;
  /** Provider-side identifier of the underlying resource, of the form `<provider-prefix>_<uuid>`. */
  realId: string;
  /**
   * Name of the zone the add-on is hosted in.
   * @renamedFrom `region`
   */
  zone: string;
  /** Identifier of the zone the add-on is hosted in. */
  zoneId: string;
  /** Provider that operates this add-on. Its plans and features are listed separately. */
  provider: AddonProvider;
  /** Pricing plan the add-on is currently subscribed to. */
  plan: AddonProviderPlan;
  /**
   * When the add-on was provisioned.
   * @renamedFrom `creationDate`
   * @converted to an ISO date string
   */
  createdAt: string;
  /** Names of the environment variables the add-on exposes to linked applications. Sorted. */
  configKeys: Array<string>;
}
