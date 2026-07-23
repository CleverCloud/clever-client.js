import type { ApplicationId } from '../../types/cc-api.types.js';
import type { DeploymentAction, DeploymentLegacy } from './deployment.types.js';

/**
 * Scope of the listing: a single application, or every application of an organisation.
 */
export type ListDeploymentCommandInput = ListOrganisationDeploymentCommandInput | ListApplicationDeploymentCommandInput;

/**
 * Lists the deployments of every application of an organisation.
 */
export interface ListOrganisationDeploymentCommandInput {
  /** Identifier of the organisation whose deployments are listed. */
  ownerId: string;
  /** Maximum number of deployments to return. */
  limit?: number;
}

/**
 * Lists the deployments of a single application. The owner is resolved automatically when omitted.
 */
export interface ListApplicationDeploymentCommandInput extends ApplicationId {
  /** Maximum number of deployments to return. Defaults to 10 on the backend side. */
  limit?: number;
  /** Number of deployments to skip before starting to collect the result. */
  offset?: number;
  /** Keep only the deployments performing this action. An unknown action yields an empty result. */
  action?: DeploymentAction;
}

/**
 * The matching deployments, in the legacy v2 shape.
 */
export type ListDeploymentCommandOutput = Array<DeploymentLegacy>;
