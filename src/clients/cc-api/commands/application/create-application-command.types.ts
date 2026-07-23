import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { Application, ApplicationLifetime } from './application.types.js';

/**
 * Description of the application to create. Only the owner, the name, the runtime and the smallest
 * scaler size are required: everything else falls back to a documented default.
 */
export interface CreateApplicationCommandInput {
  /** Reserved for internal use. */
  applianceId?: string;
  /**
   * Whether the application starts archived, that is excluded from listings.
   * @sentAs `archived`
   */
  isArchived?: boolean;
  /** Branch deployments are taken from. Defaults to `master`. */
  branch?: string;
  /** Scaler size to build on. Defaults to an empty string, and setting it turns the separated build on. */
  buildFlavor?: string;
  /** Whether pushing new code cancels a deployment that is still running. */
  cancelOnPush?: boolean;
  /** Protocol the code will be pushed with. Defaults to `git`. */
  deploy?: string;
  /** Free text description of the application. */
  description?: string;
  /**
   * Environment variables to set on the application. Defaults to an empty list.
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
  /** Runtime to run the application on, either fully qualified or given as a variant slug. */
  instance: ApplicationInstance | ApplicationInstanceSlug;
  /** What the instances are for: a regular deployment, a migration, or a one-off task. */
  instanceLifetime?: ApplicationLifetime;
  /** Biggest scaler size the application may scale up to. Defaults to `minFlavor`. */
  maxFlavor?: string;
  /** Upper bound of the horizontal scaling window. Defaults to `1`. */
  maxInstances?: number;
  /** Smallest scaler size the application may run on, for example `nano`. */
  minFlavor: string;
  /** Lower bound of the horizontal scaling window. Defaults to `1`. */
  minInstances?: number;
  /** Display name of the application. */
  name: string;
  /** External forge to wire the application to, so that pushes trigger deployments. */
  oauthApp?: ApplicationOauthApp;
  /** Identifier of the user or organisation that will own the application. */
  ownerId: string;
  /** URL of a public git repository to seed the application from. */
  publicGitRepositoryUrl?: string;
  /**
   * Whether the build runs on its own instance. Forced on when `buildFlavor` is set.
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
  /** Tags to attach to the application. */
  tags?: Array<string>;
  /** Name of the zone to run the application in. Defaults to `par`. */
  zone?: string;
}

/**
 * The freshly created application, completed with the branches of its deployment repository.
 */
export type CreateApplicationCommandOutput = Application;

/**
 * A runtime designated by the slug of one of its variants, for example `node`. The latest enabled
 * runtime carrying that slug is resolved before the application is created.
 */
export interface ApplicationInstanceSlug {
  /** Slug of the runtime variant to look up. */
  slug: string;
}

/**
 * A fully qualified runtime, as published by the product catalogue.
 */
export interface ApplicationInstance {
  /** Identifier of the runtime, for example `node`. */
  type: string;
  /** Version of the runtime. */
  version: string;
  /** Identifier of the runtime variant. */
  variant: string;
}

/**
 * The external forge to wire the application to. Only GitHub is supported so far.
 */
type ApplicationOauthApp = ApplicationOauthAppGithub;

/**
 * A GitHub repository to wire the application to.
 */
interface ApplicationOauthAppGithub {
  /**
   * Discriminant of the forge.
   * @sentAs `oauthService`
   */
  type: 'github';
  /**
   * Identifier of the GitHub repository.
   * @sentAs `oauthAppId`
   */
  id: string;
}

/**
 * Same as {@link CreateApplicationCommandInput}, once the runtime has been resolved to its fully
 * qualified form.
 *
 * @internal
 */
export interface CreateApplicationInnerCommandInput extends Omit<CreateApplicationCommandInput, 'instance'> {
  /** Fully qualified runtime to run the application on. */
  instance: ApplicationInstance;
}
