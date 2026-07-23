import type { AddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the add-on to sign into. The owner is resolved automatically when omitted.
 */
export type GetAddonSsoCommandInput = AddonId;

/**
 * A signed single sign-on payload to submit to the add-on provider's console.
 */
export interface GetAddonSsoCommandOutput {
  /** SSO endpoint of the provider to submit this payload to. */
  url: string;
  /** Provider-side identifier of the add-on, matching its `realId`. */
  id: string;
  /** Unix timestamp, in seconds, the payload was signed at. Providers reject stale payloads. */
  timestamp: number;
  /** Digest proving the add-on identity, derived from the add-on id, the provider salt and the timestamp. */
  token: string;
  /** Digest proving the user identity, derived from the add-on, user, email, nav data, salt and timestamp. */
  signature: string;
  /**
   * Email address of the user being signed in.
   * @renamedFrom `email`
   */
  emailAddress: string;
  /**
   * Identifier of the user being signed in.
   * @renamedFrom `user_id`
   */
  userId: string;
  /**
   * Digest over the user information, for providers that require it.
   * @renamedFrom `userinfo_signature`
   */
  userInfoSignature: string;
  /** Display name of the user being signed in. */
  name: string;
  /**
   * Navigation context handed over to the provider console.
   * @renamedFrom `nav-data`
   */
  navData: string;
}
