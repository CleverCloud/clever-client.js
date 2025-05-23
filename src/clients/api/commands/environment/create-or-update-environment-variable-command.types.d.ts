import { ApplicationId } from '../../types/cc-api.types.js';

export interface CreateOrUpdateEnvironmentVariableCommandInput extends ApplicationId {
  name: string;
  value: string;
}

export interface CreateOrUpdateEnvironmentVariableCommandOutput {}
