import type { MfaKind } from '../auth/auth.types.js';
import type { ContextFlag } from '../organisation/organisation.types.js';

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
  /** Display name of the user. Absent until they set one. */
  name?: string;
  /** Phone number of the user. Absent until they set one. */
  phone?: string;
  /** Street address, used on the invoices. Absent until the billing details are filled. */
  address?: string;
  /** City, used on the invoices. Absent until the billing details are filled. */
  city?: string;
  /** Postal code, used on the invoices. Absent until the billing details are filled. */
  zipcode?: string;
  /** Country, used on the invoices and to work out the applicable VAT. Absent until the billing details are filled. */
  country?: string;
  /** URL of the user's avatar. Absent when they never set one and signed up without an external provider. */
  avatar?: string;
  /**
   * When the account was created.
   * @renamedFrom `creationDate`
   * @converted to an ISO date string
   */
  createdAt: string;
  /**
   * Language the Console and the emails are served in. Absent when the user never picked one.
   * @renamedFrom `lang`
   */
  language?: string;
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
  /**
   * Whether the account details are complete enough for it to be billed: a confirmed email address, a name, a phone
   * number, and a full postal address.
   */
  canPay: boolean;
  /**
   * Second authentication factor the user signs in with, `NONE` when they have none.
   * @renamedFrom `preferredMFA`
   */
  preferredMfa: MfaKind;
  /** Whether the account has a password, as opposed to signing in only through an external provider. */
  hasPassword: boolean;
  /** Identifier of the partner the user signed up through. */
  partnerId: string;
  /** Display name of the partner the user signed up through. */
  partnerName: string;
  /** URL of the console of the partner the user signed up through. */
  partnerConsoleUrl: string;
  /** Self-service features that partner forbids. Empty when nothing is forbidden. */
  contextFlags: Array<ContextFlag>;
}
