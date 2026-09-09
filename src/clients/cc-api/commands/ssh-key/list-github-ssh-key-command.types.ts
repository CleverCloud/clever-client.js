import type { SshKey } from './ssh-key.types.js';

/**
 * The keys found on the linked GitHub account, sorted by name.
 */
export type ListGithubSshKeyCommandOutput = Array<SshKey>;
