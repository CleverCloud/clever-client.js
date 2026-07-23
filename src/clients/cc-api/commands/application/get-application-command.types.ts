import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Application } from './application.types.js';

/**
 * Identifies the application to retrieve. The owner is resolved automatically when omitted.
 */
export interface GetApplicationCommandInput extends ApplicationId {
  /** Whether to also fetch the branches of the deployment repository. Costs one extra request. */
  withBranches?: boolean;
}

/**
 * The requested application. Its `branches` are only filled when `withBranches` was set.
 */
export type GetApplicationCommandOutput = Application;
