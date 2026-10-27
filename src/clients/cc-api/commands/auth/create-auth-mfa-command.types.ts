import type {
  MfaKind,
  RefusedAuthCredential,
  RefusedCredentialCommandOutput,
  ResolveRefusedCredentialInput,
} from './auth.types.js';

/**
 * Which factor to enrol into, and the password proving the caller owns the account.
 */
export interface CreateAuthMfaCommandInput extends ResolveRefusedCredentialInput {
  /** Kind of second factor to enrol into. */
  kind: MfaKind;
  /** Current account password. Sent base64-encoded in the `X-Clever-Password` header. */
  password: string;
}

/**
 * The output of the command, depending on `shouldResolveRefusedCredential`.
 *
 * @template TInput - The input the command was built with
 */
export type CreateAuthMfaCommandOutput<TInput extends CreateAuthMfaCommandInput = CreateAuthMfaCommandInput> =
  RefusedCredentialCommandOutput<TInput, CreateAuthMfaCommandResponse, CreateAuthMfaResult>;

/**
 * What came of the enrolment when `shouldResolveRefusedCredential` is set: the enrolment secret, or
 * the refused password. Every other failure still rejects.
 */
export type CreateAuthMfaResult = CreatedAuthMfaResult | RefusedAuthCredential<'invalid-password'>;

/**
 * The enrolment secret, as a variant of {@link CreateAuthMfaResult}.
 */
export interface CreatedAuthMfaResult extends CreateAuthMfaCommandResponse {
  type: 'created';
}

/**
 * The enrolment secret handed to the authenticator app.
 */
export interface CreateAuthMfaCommandResponse {
  /** `otpauth://` URL holding the shared secret, usually rendered as a QR code. */
  url: string;
}
