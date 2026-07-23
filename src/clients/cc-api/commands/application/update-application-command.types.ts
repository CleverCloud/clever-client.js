import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Application, ApplicationLifetime } from './application.types.js';

/**
 * Identifies the application to update, along with the fields to change. Every field is optional:
 * those left out keep their current value.
 */
export interface UpdateApplicationCommandInput extends ApplicationId {
  /**
   * Whether the application is archived, that is excluded from listings.
   * @sentAs `archived`
   */
  isArchived?: boolean;
  /** New branch to deploy from. Applied through a separate request. */
  branch?: string;
  /** New scaler size to build on. */
  buildFlavor?: string;
  /** Whether pushing new code cancels a deployment that is still running. */
  cancelOnPush?: boolean;
  /** New protocol the code is pushed with. */
  deploy?: string;
  /** New free text description of the application. */
  description?: string;
  /**
   * New environment variables, replacing the current ones.
   * @sentAs `env`
   * @converted to a `Record<string, string>`
   */
  environment?: Array<EnvironmentVariable>;
  /**
   * Whether the application is marked as a favourite.
   * @sentAs `favourite`
   */
  isFavourite?: boolean;
  /**
   * Whether plain HTTP requests are redirected to HTTPS.
   * @sentAs `forceHttps`
   * @converted from a boolean to `ENABLED`/`DISABLED`
   */
  shouldForceHttps?: boolean;
  /**
   * Whether a new deployment is rolled out alongside the running one before traffic is switched.
   * @sentAs `homogeneous`
   * @converted with the boolean inverted
   */
  isZeroDowntimeDeploymentEnabled?: boolean;
  /** What the instances are for: a regular deployment, a migration, or a one-off task. */
  instanceLifetime?: ApplicationLifetime;
  /** New upper bound of the vertical scaling window. */
  maxFlavor?: string;
  /** New upper bound of the horizontal scaling window. */
  maxInstances?: number;
  /** New lower bound of the vertical scaling window. */
  minFlavor?: string;
  /** New lower bound of the horizontal scaling window. */
  minInstances?: number;
  /** New display name of the application. */
  name?: string;
  /**
   * Whether the build runs on its own instance.
   * @sentAs `separateBuild`
   */
  hasSeparatedBuild?: boolean;
  /**
   * Whether the application may be stopped.
   * @sentAs `shutdownable`
   */
  canShutdown?: boolean;
  /**
   * Whether the load balancer pins a client to the instance that served it first.
   * @sentAs `stickySessions`
   */
  hasStickySessions?: boolean;
  /** New tags attached to the application, replacing the current ones. */
  tags?: Array<string>;
  /** New zone to run the application in. */
  zone?: string;
}

/**
 * The application as it stands after the update, completed with the branches of its deployment
 * repository.
 */
export type UpdateApplicationCommandOutput = Application;

/**
 * Identifies the application whose deployment branch is changed, along with the new branch.
 *
 * @internal
 */
export interface UpdateApplicationBranchCommandInput extends ApplicationId {
  /** New branch to deploy from. */
  branch: string;
}
