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
  /**
   * Whether a refused credential resolves as a result instead of rejecting.
   *
   * A rejection reaches the `hooks.onError` callback given to the client, which may take the 401 of a
   * mistyped password for an expired session. Set it to handle the refusal as a result that is never reported. The
   * output then carries a `type` telling the created token from each refusal.
   *
   * @default false
   */
  shouldResolveRefusedCredential?: boolean;
}

/**
 * The output of the command, depending on `shouldResolveRefusedCredential`.
 *
 * - Unset or `false`: the created token, and a refused credential rejects.
 * - `true`: a result discriminated on `type`, the created token or the refused credential.
 * - Unknown at compile time, typed `boolean`: either of them.
 *
 * @template TInput - The input the command was built with
 */
export type CreateApiTokenCommandOutput<TInput extends CreateApiTokenCommandInput = CreateApiTokenCommandInput> = [
  ShouldResolveRefusedCredential<TInput>,
] extends [true]
  ? CreateApiTokenResult
  : [ShouldResolveRefusedCredential<TInput>] extends [false | undefined]
    ? CreateApiTokenCommandResponse
    : CreateApiTokenCommandResponse | CreateApiTokenResult;

type ShouldResolveRefusedCredential<TInput> = TInput extends { shouldResolveRefusedCredential?: infer Flag }
  ? Flag
  : undefined;

/**
 * What came of the creation when `shouldResolveRefusedCredential` is set: the token, or which of the
 * given credentials was refused. Every other failure still rejects.
 */
export type CreateApiTokenResult =
  | CreatedApiTokenResult
  | RefusedApiTokenCredential<'invalid-credential'>
  | RefusedApiTokenCredential<'invalid-mfa-code'>;

/**
 * The created token, as a variant of {@link CreateApiTokenResult}.
 */
export interface CreatedApiTokenResult extends CreateApiTokenCommandResponse {
  type: 'created';
}

/**
 * A credential the bridge refused.
 *
 * - `invalid-credential`: the email address or the password is wrong.
 * - `invalid-mfa-code`: the second factor code is wrong, or missing on an account that has one enrolled.
 *
 * @template Type - The code of the refusal, one variant each so that `type` narrows the result
 */
export interface RefusedApiTokenCredential<Type extends 'invalid-credential' | 'invalid-mfa-code'> {
  type: Type;
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
