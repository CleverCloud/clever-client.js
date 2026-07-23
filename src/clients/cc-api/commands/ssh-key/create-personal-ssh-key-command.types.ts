import type { SshKey } from './ssh-key.types.js';

/**
 * The key to register, and the name to file it under.
 */
export interface CreatePersonalSshKeyCommandInput {
  /** Name to register the key under, unique per account. Goes into the URL path. */
  name: string;
  /**
   * Public key in the OpenSSH one-line format.
   * @sentAs the whole request body
   */
  key: string;
}

/**
 * The registered key, read back so it carries its fingerprint.
 */
export type CreatePersonalSshKeyCommandOutput = SshKey;
