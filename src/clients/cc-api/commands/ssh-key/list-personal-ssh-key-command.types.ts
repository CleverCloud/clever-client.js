import type { SshKey } from './ssh-key.types.ts';

/**
 * The keys registered on the account, sorted by name.
 */
export type ListPersonalSshKeyCommandOutput = Array<SshKey>;
