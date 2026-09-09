import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Identifies the application whose branches are listed. The owner is resolved automatically when omitted.
 */
export type GetApplicationBranchesCommandInput = ApplicationId;

/**
 * The branch names available on the deployment repository, sorted.
 */
export type GetApplicationBranchesCommandOutput = Array<string>;
