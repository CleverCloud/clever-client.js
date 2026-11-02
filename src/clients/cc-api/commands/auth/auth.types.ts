/**
 * A second authentication factor. `TOTP` is a time based one-time password, as produced by an
 * authenticator app; `NONE` stands for no second factor at all.
 */
export type MfaKind = 'NONE' | 'TOTP';

/**
 * The option shared by the commands that ask for the account password again.
 */
export interface ResolveRefusedCredentialInput {
  /**
   * Whether a refused credential resolves as a result instead of rejecting.
   *
   * A rejection reaches the `hooks.onError` callback given to the client, which may take the 401 of a
   * mistyped password for an expired session. Set it to handle the refusal as a result that is never reported. The
   * output then carries a `type` telling the success from each refusal.
   *
   * @default false
   */
  shouldResolveRefusedCredential?: boolean;
}

/**
 * The output of a command taking {@link ResolveRefusedCredentialInput}, depending on `shouldResolveRefusedCredential`.
 *
 * - Unset or `false`: the response, and a refused credential rejects.
 * - `true`: a result discriminated on `type`, the success or the refused credential.
 * - Unknown at compile time, typed `boolean`: either of them.
 *
 * @template TInput - The input the command was built with
 * @template Response - What the command resolves by default
 * @template Result - What the command resolves when a refused credential resolves too
 */
export type RefusedCredentialCommandOutput<TInput extends ResolveRefusedCredentialInput, Response, Result> = [
  ShouldResolveRefusedCredential<TInput>,
] extends [true]
  ? Result
  : [ShouldResolveRefusedCredential<TInput>] extends [false | undefined]
    ? Response
    : Response | Result;

type ShouldResolveRefusedCredential<TInput> = TInput extends { shouldResolveRefusedCredential?: infer Flag }
  ? Flag
  : undefined;

/**
 * A credential the API refused.
 *
 * - `invalid-password`: the account password is wrong.
 * - `invalid-mfa-code`: the code produced by the authenticator app is wrong.
 *
 * @template Type - The code of the refusal, one variant each so that `type` narrows the result
 */
export interface RefusedAuthCredential<Type extends RefusedAuthCredentialType> {
  type: Type;
}

export type RefusedAuthCredentialType = 'invalid-password' | 'invalid-mfa-code';

/**
 * Whether a second factor of a given kind is turned on for the current user.
 */
export interface AuthMfa {
  /** Kind of second factor. */
  kind: MfaKind;
  /**
   * Whether the factor is active.
   * @renamedFrom `configured`
   */
  isConfigured: boolean;
  /** How many backup codes are left. Absent when the factor is not active. */
  backupCodesState?: AuthMfaBackupCodesState;
}

/**
 * How many backup codes of an active factor are left, without the codes themselves.
 */
export interface AuthMfaBackupCodesState {
  /** Backup codes not used yet. */
  remaining: number;
  /** Backup codes in the set. */
  total: number;
  /**
   * When the set was generated. For a set generated before the API recorded it, the date it started
   * recording, not the real one: do not show it as the generation date of an older set.
   */
  generatedAt: string;
}

/**
 * A new set of backup codes. The API returns them once: no later call shows them again.
 */
export interface AuthMfaBackupCodes {
  /** The backup codes, each usable once in place of a code from the authenticator app. */
  backupCodes: Array<string>;
}
