import { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface UpdateConfigProviderCommandInput {
  addonId: string;
  environment: Array<EnvironmentVariable>;
}

export type UpdateConfigProviderCommandOutput = Array<EnvironmentVariable>;
