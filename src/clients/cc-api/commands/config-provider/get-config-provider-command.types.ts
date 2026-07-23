import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface GetConfigProviderCommandInput {
  addonId: string;
}

// transformed: sorted by name
export type GetConfigProviderCommandOutput = Array<EnvironmentVariable>;
