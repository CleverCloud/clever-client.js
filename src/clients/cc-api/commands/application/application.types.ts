import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { Domain } from '../domain/domain.types.js';
import type { ProductRuntimeFlavor, ProductRuntimeVariant } from '../product/product.types.js';

/**
 * An application deployed on Clever Cloud: the code, the runtime it is built and run on, the
 * scaling window it lives in, and the domains it answers on.
 */
export interface Application {
  /** Identifier of the application, of the form `app_<uuid>`. */
  id: string;
  /** Identifier of the user or organisation owning the application. */
  ownerId: string;
  /** Display name of the application. */
  name: string;
  /** Free text description of the application. */
  description: string;
  /** Name of the zone the application runs in. */
  zone: string;
  /** Identifier of the zone the application runs in. */
  zoneId: string;
  /** The runtime the application runs on, and how it is allowed to scale. */
  instance: {
    /** Identifier of the runtime, for example `node` or `docker`. */
    type: string;
    /** Version of the runtime. */
    version: string;
    /** Flavour of the runtime the application was created with, carrying its display name and logo. */
    variant: ProductRuntimeVariant;
    /** Lower bound of the horizontal scaling window. */
    minInstances: number;
    /** Upper bound of the horizontal scaling window. */
    maxInstances: number;
    /** Highest number of instances the owner's plan allows, whatever `maxInstances` says. */
    maxAllowedInstances: number;
    /** Lower bound of the vertical scaling window. */
    minFlavor: ProductRuntimeFlavor;
    /** Upper bound of the vertical scaling window. */
    maxFlavor: ProductRuntimeFlavor;
    /** Every scaler size available for this runtime, sorted by price. */
    flavors: Array<ProductRuntimeFlavor>;
    /**
     * Environment variables the runtime injects on its own.
     * @renamedFrom `defaultEnv`
     * @converted from a `Record<string, string>` to an array sorted by name
     */
    defaultEnvironment: Array<EnvironmentVariable>;
    /** Whether the instances are long lived or spawned for a one-off job. */
    lifetime: ApplicationLifetime;
  };
  /** How the code reaches the platform, and where the instances can be pushed to. */
  deployment: {
    /**
     * Whether the application may be stopped.
     * @renamedFrom `shutdownable`
     */
    canShutdown: boolean;
    /** Protocol used to push the code. */
    type: ApplicationDeploymentType;
    /** Provisioning state of the deployment repository. */
    repoState: ApplicationRepositoryState;
    /** Remote to push the code to, for example the Clever Cloud git URL. */
    url: string;
    /** HTTP form of the deployment remote, when the source is an external forge such as GitHub. */
    httpUrl?: string;
  };
  /**
   * Domains the application answers on.
   * @renamedFrom `vhosts`
   * @converted each entry reduced to its `fqdn`
   * @converted sorted by domain
   */
  domains: Array<Domain>;
  /**
   * When the application was created.
   * @renamedFrom `creationDate`
   * @converted to an ISO date string
   */
  createdAt: string;
  /**
   * Unix timestamp of the last deployment.
   * @renamedFrom `last_deploy`
   */
  lastDeployedAt: number;
  /**
   * Whether the application is archived, that is kept but excluded from listings.
   * @renamedFrom `archived`
   */
  isArchived: boolean;
  /**
   * Whether the load balancer pins a client to the instance that served it first.
   * @renamedFrom `stickySessions`
   */
  hasStickySessions: boolean;
  /**
   * Whether a new deployment is rolled out alongside the running one before traffic is switched.
   * @renamedFrom `homogeneous`
   * @converted with the boolean inverted
   */
  isZeroDowntimeDeploymentEnabled: boolean;
  /**
   * Whether the current user marked this application as a favourite.
   * @renamedFrom `favourite`
   */
  isFavourite: boolean;
  /** Whether pushing new code cancels a deployment that is still running. */
  cancelOnPush: boolean;
  /**
   * The external forge the application is wired to, when there is one.
   * @renamedFrom `oauthService`
   * @converted built from the `webhookSecret` and `webhookUrl` payload fields
   */
  oauthApp?: ApplicationOauthApp;
  /**
   * Whether the build runs on its own dedicated instance rather than on the run instance.
   * @renamedFrom `separateBuild`
   */
  hasSeparatedBuild: boolean;
  /** Scaler size used for the build, when the build is separated. */
  buildFlavor: ProductRuntimeFlavor;
  /** Whether the application is meant to be running, and why it may not be. */
  state: ApplicationState;
  /** Commit currently deployed, or the commit the application is pinned to. */
  commitId: string;
  /** Reserved for internal use, always null. */
  appliance: null;
  /** Branch deployments are taken from. */
  branch: string;
  /** Branches available on the deployment repository, sorted. Only filled by the commands that fetch them. */
  branches?: Array<string>;
  /**
   * Whether plain HTTP requests are redirected to HTTPS.
   * @renamedFrom `forceHttps`
   * @converted from `ENABLED`/`DISABLED` to a boolean
   */
  shouldForceHttps: boolean;
  /**
   * Environment variables set on the application.
   * @renamedFrom `env`
   * @converted sorted by name
   */
  environment: Array<EnvironmentVariable>;
}

/**
 * What the instances of an application are for: a regular long lived deployment, a one-off data
 * migration, or a task that exits once it is done.
 */
export type ApplicationLifetime = 'REGULAR' | 'MIGRATION' | 'TASK';

/**
 * Whether the application should be running, and what is keeping it down when it is not:
 * a moderation decision or an unpaid invoice.
 */
export type ApplicationState =
  | 'SHOULD_BE_UP'
  | 'SHOULD_BE_DOWN'
  | 'WANTS_TO_BE_UP'
  | 'MODERATED'
  | 'DEFAULT_OF_PAYMENT';

/**
 * Protocol the code is pushed with.
 */
export type ApplicationDeploymentType = 'GIT' | 'SFTP' | 'FTP';

/**
 * Provisioning state of the git repository backing an application.
 */
export type ApplicationRepositoryState = 'CREATING' | 'CREATED' | 'NOT_NEEDED' | 'DELETED';

/**
 * The external forge an application is wired to. Only GitHub is supported so far.
 */
export type ApplicationOauthApp = ApplicationOauthAppGithub;

/**
 * A GitHub repository wired to an application, so that pushes trigger deployments.
 */
export interface ApplicationOauthAppGithub {
  /** Discriminant of the forge. */
  type: 'github';
  /** Secret GitHub signs the webhook payloads with. Built from the `webhookSecret` payload field. */
  secret: string;
  /** URL GitHub posts the push events to. */
  webhookUrl: string;
}
