import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Application, ApplicationLifetime } from './application.types.js';

export interface UpdateApplicationCommandInput extends ApplicationId {
  isArchived?: boolean;
  branch?: string;
  buildFlavor?: string;
  cancelOnPush?: boolean;
  deploy?: string;
  description?: string;
  // renamed from env and converted from Record<string, string>
  environment?: Array<EnvironmentVariable>;
  isFavourite?: boolean;
  // converted from ENABLED|DISABLED to boolean
  shouldForceHttps?: boolean;
  // inverted from homogeneous
  isZeroDowntimeDeploymentEnabled?: boolean;
  instanceLifetime?: ApplicationLifetime;
  maxFlavor?: string;
  maxInstances?: number;
  minFlavor?: string;
  minInstances?: number;
  name?: string;
  hasSeparatedBuild?: boolean;
  canShutdown?: boolean;
  hasStickySessions?: boolean;
  tags?: Array<string>;
  zone?: string;
}

export type UpdateApplicationCommandOutput = Application;

/**
 * @internal
 */
export interface UpdateApplicationBranchCommandInput extends ApplicationId {
  branch: string;
}
