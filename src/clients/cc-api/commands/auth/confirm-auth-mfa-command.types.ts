import type {
  AuthMfaBackupCodes,
  MfaKind,
  RefusedAuthCredential,
  RefusedCredentialCommandOutput,
  ResolveRefusedCredentialInput,
} from './auth.types.ts';

/**
 * The enrolment to confirm, and the proof that it works.
 */
export interface ConfirmAuthMfaCommandInput extends ResolveRefusedCredentialInput {
  /** Kind of second factor being confirmed. */
  kind: MfaKind;
  /** Code produced by the authenticator app from the enrolment secret. */
  code: string;
  /** Current account password. Sent base64-encoded in the `X-Clever-Password` header. */
  password: string;
  /**
   * Whether to invalidate every other session and token of the account.
   * @sentAs `revokeTokens`
   */
  shouldRevokeTokens?: boolean;
}

/**
 * The output of the command, depending on `shouldResolveRefusedCredential`.
 *
 * @template TInput - The input the command was built with
 */
export type ConfirmAuthMfaCommandOutput<TInput extends ConfirmAuthMfaCommandInput = ConfirmAuthMfaCommandInput> =
  RefusedCredentialCommandOutput<TInput, ConfirmAuthMfaCommandResponse, ConfirmAuthMfaResult>;

/**
 * What came of the confirmation when `shouldResolveRefusedCredential` is set: the factor turned on
 * with its backup codes, or which of the given credentials was refused. Every other failure still rejects.
 */
export type ConfirmAuthMfaResult =
  | ConfirmedAuthMfaResult
  | RefusedAuthCredential<'invalid-password'>
  | RefusedAuthCredential<'invalid-mfa-code'>;

/**
 * The factor turned on and its backup codes, as a variant of {@link ConfirmAuthMfaResult}.
 */
export interface ConfirmedAuthMfaResult extends ConfirmAuthMfaCommandResponse {
  type: 'confirmed';
}

/**
 * The backup codes of the factor just turned on. Save them: no later call shows them again.
 */
export type ConfirmAuthMfaCommandResponse = AuthMfaBackupCodes;
