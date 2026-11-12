import type {
  AuthMfaBackupCodes,
  MfaKind,
  RefusedAuthCredential,
  RefusedCredentialCommandOutput,
  ResolveRefusedCredentialInput,
} from './auth.types.ts';

/**
 * Which factor to renew the backup codes of, and the password proving the caller owns the account.
 */
export interface ResetAuthMfaBackupCodesCommandInput extends ResolveRefusedCredentialInput {
  /** Kind of second factor the codes back up. */
  kind: MfaKind;
  /** Current account password. Sent base64-encoded in the `X-Clever-Password` header. */
  password: string;
}

/**
 * The output of the command, depending on `shouldResolveRefusedCredential`.
 *
 * @template TInput - The input the command was built with
 */
export type ResetAuthMfaBackupCodesCommandOutput<
  TInput extends ResetAuthMfaBackupCodesCommandInput = ResetAuthMfaBackupCodesCommandInput,
> = RefusedCredentialCommandOutput<TInput, ResetAuthMfaBackupCodesCommandResponse, ResetAuthMfaBackupCodesResult>;

/**
 * What came of the renewal when `shouldResolveRefusedCredential` is set: the new backup codes, or the
 * refused password. Every other failure still rejects.
 */
export type ResetAuthMfaBackupCodesResult =
  | ResetAuthMfaBackupCodesSucceededResult
  | RefusedAuthCredential<'invalid-password'>;

/**
 * The new backup codes, as a variant of {@link ResetAuthMfaBackupCodesResult}.
 */
export interface ResetAuthMfaBackupCodesSucceededResult extends ResetAuthMfaBackupCodesCommandResponse {
  type: 'reset';
}

export type ResetAuthMfaBackupCodesCommandResponse = AuthMfaBackupCodes;
