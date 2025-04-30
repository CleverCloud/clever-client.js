import type { ApplicationId } from '../../types/cc-api.types.js';
import type { DeploymentAction, DeploymentLegacy } from './deployment.types.js';

export type ListDeploymentCommandInput = ListOrganisationDeploymentCommandInput | ListApplicationDeploymentCommandInput;

export interface ListOrganisationDeploymentCommandInput {
  ownerId: string;
  limit?: number;
}

export interface ListApplicationDeploymentCommandInput extends ApplicationId {
  limit?: number;
  offset?: number;
  action?: DeploymentAction;
}

export type ListDeploymentCommandOutput = Array<DeploymentLegacy>;
