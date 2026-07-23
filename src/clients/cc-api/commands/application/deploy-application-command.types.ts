import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Identifies the application to deploy, and what to deploy on it.
 */
export interface DeployApplicationCommandInput extends ApplicationId {
  /** Commit to deploy. Defaults to the last commit already known to the platform. */
  commit?: string;
  /** Whether the build cache may be reused. Set it to `false` to force a clean rebuild. */
  useCache?: boolean;
}

/**
 * A handle on the deployment that was just queued.
 */
export interface DeployApplicationCommandOutput {
  /** Identifier of the deployment, to follow its progress through the deployment endpoints. */
  deploymentId: string;
}
