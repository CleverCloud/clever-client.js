import { ApplicationId } from '../../types/cc-api.types.js';

export interface DeployApplicationCommandInput extends ApplicationId {
  commit?: string;
  useCache?: boolean;
}

export interface DeployApplicationCommandOutput {
  deploymentId: string;
}
