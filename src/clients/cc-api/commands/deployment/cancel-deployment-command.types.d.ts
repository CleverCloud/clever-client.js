import { ApplicationId } from '../../types/cc-api.types.js';

export interface CancelDeploymentCommandInput extends ApplicationId {
  deploymentId: string;
}
