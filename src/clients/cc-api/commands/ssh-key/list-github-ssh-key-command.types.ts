import type { SshKey } from './ssh-key.types.ts';

/**
 * The keys found on the linked GitHub account, sorted by name.
 */
export type ListGithubSshKeyCommandOutput = Array<SshKey>;
