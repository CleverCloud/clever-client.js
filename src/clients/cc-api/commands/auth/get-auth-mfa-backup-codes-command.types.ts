import type {
  MfaKind,
  RefusedAuthCredential,
  RefusedCredentialCommandOutput,
  ResolveRefusedCredentialInput,
} from './auth.types.js';

/**
 * Which factor the backup codes belong to, and the password proving the caller owns the account.
 */
export interface GetAuthMfaBackupCodesCommandInput extends ResolveRefusedCredentialInput {
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
export type GetAuthMfaBackupCodesCommandOutput<
  TInput extends GetAuthMfaBackupCodesCommandInput = GetAuthMfaBackupCodesCommandInput,
> = RefusedCredentialCommandOutput<TInput, GetAuthMfaBackupCodesCommandResponse, GetAuthMfaBackupCodesResult>;

/**
 * What came of the retrieval when `shouldResolveRefusedCredential` is set: the backup codes, or the
 * refused password. Every other failure still rejects.
 */
export type GetAuthMfaBackupCodesResult = RetrievedAuthMfaBackupCodesResult | RefusedAuthCredential<'invalid-password'>;

/**
 * The backup codes, as a variant of {@link GetAuthMfaBackupCodesResult}.
 */
export interface RetrievedAuthMfaBackupCodesResult {
  type: 'retrieved';
  /** The backup codes, each usable once. */
  backupCodes: GetAuthMfaBackupCodesCommandResponse;
}

/**
 * The backup codes, each usable once. Flattened from the `Array<{ code: string }>` the API returns.
 */
export type GetAuthMfaBackupCodesCommandResponse = Array<string>;
