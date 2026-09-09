import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProvider } from './addon-provider.types.js';

/**
 * Identifies the provider to update, along with the fields to change. Every field is optional:
 * those left out keep their current value.
 */
export interface UpdateAddonProviderCommandInput extends AddonProviderId {
  /** New display name of the provider. */
  name?: string;
  /** New public website of the provider. */
  website?: string;
  /** New support email address. */
  supportEmail?: string;
  /** New Google Plus handle. Kept for backward compatibility, no longer used. */
  googlePlusName?: string;
  /** New Twitter handle. */
  twitterName?: string;
  /** New analytics identifier. */
  analyticsId?: string;
  /**
   * New one line description shown in listings.
   * @sentAs `shortDesc`
   */
  shortDescription?: string;
  /**
   * New full description shown on the provider page.
   * @sentAs `longDesc`
   */
  longDescription?: string;
  /** New URL of the provider logo. */
  logoUrl?: string;
}

/**
 * The provider as it stands after the update.
 */
export type UpdateAddonProviderCommandOutput = AddonProvider;
