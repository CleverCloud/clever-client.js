import type { GithubApplication } from './github.types.ts';

/**
 * The GitHub repositories the linked account gives access to. Sorted by name.
 */
export type ListGithubApplicationCommandOutput = Array<GithubApplication>;
