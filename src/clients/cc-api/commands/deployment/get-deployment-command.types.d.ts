import type { ApplicationId } from '../../types/cc-api.types.js';
import { Deployment, type DeploymentLegacy } from './deployment.types.js';

export interface GetDeploymentCommandInput extends ApplicationId {
  deploymentId: string;
}

export type GetDeploymentCommandOutput = Deployment;

export type GetDeploymentCommandOutputLegacy = DeploymentLegacy;
