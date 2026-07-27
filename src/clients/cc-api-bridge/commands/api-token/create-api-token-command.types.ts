/**
 * The credentials proving who the token is for, and the token to mint for them.
 *
 * The account credentials are required even on an authenticated client: a token is a long lived
 * credential, so minting one always asks for the password again.
 */
export interface CreateApiTokenCommandInput {
  /**
   * Email address of the account the token will act on behalf of.
   * @sentAs `email`
   */
  emailAddress: string;
  /** Password of that account. */
  password: string;
  /** Second factor code, when the account has one enrolled. */
  mfaCode?: string;
  /** Display name to give to the token. */
  name: string;
  /** Free text note about what the token is for. */
  description?: string;
  /**
   * When the token should stop being accepted.
   *
   * The backend enforces two constraints on this date: it must be in the future, and it must be
   * less than one year (366 days) from now.
   *
   * @sentAs `expirationDate`
   * @converted to an ISO date string
   */
  expiresAt: string | Date | number;
}

/**
 * The freshly minted token. This is the only time its value is returned, so it has to be stored now.
 */
export interface CreateApiTokenCommandResponse {
  /** The token value itself, to be sent as a bearer credential. Never returned again. */
  apiToken: string;
  /** Identifier of the token, used to address it in the other commands. */
  apiTokenId: string;
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
  /** Display name of the token. */
  name: string;
  /** Free text note about what the token is for. */
  description?: string;
  /** Whether the token is usable. Always `ACTIVE` on creation. */
  state: 'ACTIVE' | 'EXPIRED';
}
