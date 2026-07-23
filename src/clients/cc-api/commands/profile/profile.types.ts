import type { MFAKind } from '../auth/auth.types.js';

/**
 * The account of the signed-in user: who they are, how they are billed, and how they sign in.
 */
export interface Profile {
  /** Identifier of the user, of the form `user_<uuid>`. */
  id: string;
  /**
   * Primary email address, the one notifications and invoices are sent to.
   * @renamedFrom `email`
   */
  emailAddress: string;
  /** Display name of the user. */
  name: string;
  /** Phone number of the user. */
  phone: string;
  /** Street address, used on the invoices. */
  address: string;
  /** City, used on the invoices. */
  city: string;
  /** Postal code, used on the invoices. */
  zipcode: string;
  /** Country, used on the invoices and to work out the applicable VAT. */
  country: string;
  /** URL of the user's avatar. */
  avatar: string;
  /**
   * When the account was created.
   * @renamedFrom `creationDate`
   * @converted to an ISO date string
   */
  createdAt: string;
  /** Language the Console and the emails are served in. */
  lang: string;
  /**
   * Whether the primary email address has been confirmed.
   * @renamedFrom `emailValidated`
   */
  isEmailValidated: boolean;
  /** Whether a GitHub account is wired to this one. Derived from `oauthApps` holding `github`. */
  isLinkedToGitHub: boolean;
  /**
   * Whether the user is a Clever Cloud employee with administrative access.
   * @renamedFrom `admin`
   */
  isAdmin: boolean;
  /** Whether the account has a usable payment method, so resources can be provisioned. */
  canPay: boolean;
  /** Second authentication factor the user signs in with, `NONE` when they have none. */
  preferredMFA: MFAKind;
  /** Whether the account has a password, as opposed to signing in only through an external provider. */
  hasPassword: boolean;
  /** Identifier of the partner the account was created through, when it was not created directly. */
  partnerId: string;
  /** Display name of that partner. */
  partnerName: string;
  /** URL of that partner's own console. */
  partnerConsoleUrl: string;
}
