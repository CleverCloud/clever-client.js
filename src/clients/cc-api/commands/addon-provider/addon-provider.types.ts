/**
 * An add-on provider along with the catalogue it publishes: the plans it can be provisioned with
 * and the features those plans are described by.
 */
export interface AddonProviderFull extends AddonProvider {
  /** Pricing plans offered by the provider, sorted by price. */
  plans: Array<AddonProviderPlan>;
  /** Features the provider's plans are described by, sorted by name. */
  features: Array<AddonProviderFeature>;
}

/**
 * The service behind an add-on: either a Clever Cloud managed service or a third party partner
 * integrated into the marketplace.
 */
export interface AddonProvider {
  /** Identifier of the provider, for example `postgresql-addon`. */
  id: string;
  /** Display name of the provider. */
  name: string;
  /** Public website of the provider. */
  website: string;
  /** Email address users should contact for support on this provider. */
  supportEmail: string;
  /** Google Plus handle of the provider. Kept for backward compatibility, no longer used. */
  googlePlusName: string;
  /** Twitter handle of the provider. */
  twitterName: string;
  /** Analytics identifier attached to the provider's marketplace pages. */
  analyticsId: string;
  /**
   * One line description shown in listings.
   * @renamedFrom `shortDesc`
   */
  shortDescription: string;
  /**
   * Full description shown on the provider page.
   * @renamedFrom `longDesc`
   */
  longDescription: string;
  /** URL of the provider logo. */
  logoUrl: string;
  /** How far along the provider is in its release cycle, which gates who may provision it. */
  status: AddonProviderStatus;
  /**
   * Whether the provider console should be opened in a new tab.
   * @renamedFrom `openInNewTab`
   */
  shouldOpenInNewTab: boolean;
  /** Whether an add-on of this provider can be moved to a bigger plan. */
  canUpgrade: boolean;
  /**
   * Names of the zones the provider can provision add-ons in.
   * @renamedFrom `regions`
   */
  zones: Array<string>;
}

/**
 * A pricing plan of an add-on provider: the unit an add-on is subscribed and billed with.
 */
export interface AddonProviderPlan {
  /** Identifier of the plan. */
  id: string;
  /** Display name of the plan, for example `XS Small Space`. */
  name: string;
  /** URL friendly name of the plan, unique within the provider. */
  slug: string;
  /** Monthly price of the plan, in the provider's billing currency. */
  price: number;
  /**
   * Identifier of the matching price in the billing system.
   * @renamedFrom `price_id`
   * @converted lowercased
   */
  priceId?: string;
  /** Values the plan gives to the provider features, sorted by name. */
  features: Array<AddonProviderPlanFeature>;
  /** Names of the zones this specific plan can be provisioned in. */
  zones: Array<string>;
}

/**
 * The value a plan gives to one of its provider's features, for example `4 GB` for `Memory`.
 */
export interface AddonProviderPlanFeature extends AddonProviderFeature {
  /** Raw value as published by the provider, meant to be displayed as is. */
  value: string;
  /**
   * Machine readable value, suited to comparisons and unit formatting.
   * @renamedFrom `computable_value`
   * @converted falls back to `value` when the API returns null
   */
  computableValue: string;
}

/**
 * A characteristic an add-on provider describes its plans with, for example `Memory` or `Disk`.
 */
export interface AddonProviderFeature {
  /** Display name of the feature. */
  name: string;
  /** How the feature values should be interpreted and formatted. */
  type: AddonProviderFeatureType;
  /**
   * Stable code identifying the feature across providers, suited to translation lookups.
   * @renamedFrom `name_code`
   * @converted falls back to `name` when the API returns null
   */
  nameCode: string;
}

/**
 * Release stage of an add-on provider. Anything below `RELEASE` is restricted to a subset of users.
 */
export type AddonProviderStatus = 'ALPHA' | 'BETA_PRIV' | 'BETA_PUB' | 'RELEASE' | 'DELETED';

/**
 * How the value of a provider feature should be read: as a flag, a duration, a size, a raw number,
 * a percentage, free text, a structured object, a byte count, or a flag on a shared resource.
 */
export type AddonProviderFeatureType =
  | 'BOOLEAN'
  | 'INTERVAL'
  | 'FILESIZE'
  | 'NUMBER'
  | 'PERCENTAGE'
  | 'STRING'
  | 'OBJECT'
  | 'BYTES'
  | 'BOOLEAN_SHARED';
