/**
 * A public SSH key trusted for git pushes and SSH access to instances.
 */
export interface SshKey {
  /** Name the key is registered under, unique per account. */
  name: string;
  /** The public key itself, in the OpenSSH one-line format. */
  key: string;
  /** Fingerprint of the key, to check it against what the SSH client reports. */
  fingerprint: string;
}
