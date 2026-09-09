/**
 * An API token: a long lived credential a user can hand to a script or a CI job instead of their
 * own OAuth tokens. The token value itself is only ever returned once, when it is created.
 */
export interface ApiToken {
  /** Identifier of the token, used to address it in the other commands. */
  apiTokenId: string;
  /** Identifier of the user the token acts on behalf of. */
  userId: string;
  /**
   * When the token was created.
   * @renamedFrom `creationDate`
   * @converted to an ISO date string
   */
  createdAt: string;
  /**
   * When the token stops being accepted.
   * @renamedFrom `expirationDate`
   * @converted to an ISO date string
   */
  expiresAt: string;
  /** IP address the token was created from. */
  ip: string;
  /** Display name of the token. */
  name: string;
  /** Free text note about what the token is for. */
  description?: string;
  /** Whether the token is still usable, or past its expiry date. */
  state: 'ACTIVE' | 'EXPIRED';
}
