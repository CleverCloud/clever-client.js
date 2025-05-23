import { ApplicationId } from '../../types/cc-api.types.js';
import type { Application, ProductRuntimeLifetime } from './application.types.js';

export interface UpdateApplicationCommandInput extends ApplicationId {
  archived?: boolean;
  branch?: string;
  buildFlavor?: string;
  cancelOnPush?: boolean;
  deploy?: string;
  description?: string;
  env?: Record<string, string>;
  favourite?: boolean;
  // converted from ENABLED|DISABLED to boolean
  forceHttps?: boolean;
  homogeneous?: boolean;
  instanceLifetime?: ProductRuntimeLifetime;
  maxFlavor?: string;
  maxInstances?: number;
  minFlavor?: string;
  minInstances?: number;
  name?: string;
  separateBuild?: boolean;
  shutdownable?: boolean;
  stickySessions?: boolean;
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
