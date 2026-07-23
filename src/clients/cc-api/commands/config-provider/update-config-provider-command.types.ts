import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface UpdateConfigProviderCommandInput {
  addonId: string;
  environment: Array<EnvironmentVariable>;
}

// transformed: sorted by name
export type UpdateConfigProviderCommandOutput = Array<EnvironmentVariable>;
