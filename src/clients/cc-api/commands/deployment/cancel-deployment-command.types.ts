import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Identifies the deployment to cancel. The owner is resolved automatically when omitted.
 */
export interface CancelDeploymentCommandInput extends ApplicationId {
  /** Identifier of the deployment to cancel, of the form `deployment_<uuid>`. */
  deploymentId: string;
}
