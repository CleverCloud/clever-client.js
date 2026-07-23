import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Deployment, DeploymentLegacy } from './deployment.types.js';

/**
 * Identifies the deployment to retrieve. The owner is resolved automatically when omitted.
 */
export interface GetDeploymentCommandInput extends ApplicationId {
  /** Identifier of the deployment to retrieve, of the form `deployment_<uuid>`. */
  deploymentId: string;
}

/**
 * The requested deployment.
 */
export type GetDeploymentCommandOutput = Deployment;

/**
 * The requested deployment, in the legacy v2 shape.
 */
export type GetDeploymentCommandOutputLegacy = DeploymentLegacy;
