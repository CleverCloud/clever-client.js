import type { Profile } from './profile.types.js';

/**
 * The account fields to change. Every field is optional: those left out keep their current value.
 */
export interface UpdateProfileCommandInput {
  /** New display name. */
  name?: string;
  /** New phone number. */
  phone?: string;
  /** New street address. */
  address?: string;
  /** New city. */
  city?: string;
  /** New postal code. */
  zipcode?: string;
  /** New country, which also decides the applicable VAT. */
  country?: string;
  /** New language for the Console and the emails. */
  lang?: string;
}

/**
 * The account as it stands after the update.
 */
export type UpdateProfileCommandOutput = Profile;
