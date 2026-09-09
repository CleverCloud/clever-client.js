import type { Application } from './application.types.js';

/**
 * Identifies the organisation whose applications are listed.
 */
export interface ListApplicationCommandInput {
  /** Identifier of the user or organisation owning the applications. */
  ownerId: string;
  /** Whether to also fetch the branches of every application. Costs one extra request per application. */
  withBranches: boolean;
}

/**
 * The applications of the organisation, in the order the API returned them. Their `branches` are
 * only filled when `withBranches` was set.
 */
export type ListApplicationCommandOutput = Array<Application>;
