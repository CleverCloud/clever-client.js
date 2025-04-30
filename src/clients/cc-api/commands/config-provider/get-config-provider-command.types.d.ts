import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface GetConfigProviderCommandInput {
  addonId: string;
}

export type GetConfigProviderCommandOutput = Array<EnvironmentVariable>;
