import type {
  MfaKind,
  RefusedAuthCredential,
  RefusedCredentialCommandOutput,
  ResolveRefusedCredentialInput,
} from './auth.types.js';

/**
 * Which factor to turn off, and the password proving the caller owns the account.
 */
export interface DeleteAuthMfaCommandInput extends ResolveRefusedCredentialInput {
  /** Kind of second factor to turn off. */
  kind: MfaKind;
  /** Current account password. Sent base64-encoded in the `X-Clever-Password` header. */
  password: string;
}

/**
 * The output of the command, depending on `shouldResolveRefusedCredential`.
 *
 * @template TInput - The input the command was built with
 */
export type DeleteAuthMfaCommandOutput<TInput extends DeleteAuthMfaCommandInput = DeleteAuthMfaCommandInput> =
  RefusedCredentialCommandOutput<TInput, undefined, DeleteAuthMfaResult>;

/**
 * What came of the deletion when `shouldResolveRefusedCredential` is set: the factor turned off, or
 * the refused password. Every other failure still rejects.
 */
export type DeleteAuthMfaResult = DeletedAuthMfaResult | RefusedAuthCredential<'invalid-password'>;

/**
 * The factor turned off, as a variant of {@link DeleteAuthMfaResult}.
 */
export interface DeletedAuthMfaResult {
  type: 'deleted';
}
