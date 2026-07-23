import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { Domain } from '../domain/domain.types.js';
import type { ProductRuntimeFlavor, ProductRuntimeVariant } from '../product/product.types.js';

export interface Application {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  zone: string;
  zoneId: string;
  instance: {
    type: string;
    version: string;
    variant: ProductRuntimeVariant;
    minInstances: number;
    maxInstances: number;
    maxAllowedInstances: number;
    minFlavor: ProductRuntimeFlavor;
    maxFlavor: ProductRuntimeFlavor;
    // transformed: sorted by price
    flavors: Array<ProductRuntimeFlavor>;
    // renamed from defaultEnv
    // transformed: converted from a Record<string, string> to an array, sorted by name
    defaultEnvironment: Array<EnvironmentVariable>;
    lifetime: ApplicationLifetime;
  };
  deployment: {
    // renamed from shutdownable
    canShutdown: boolean;
    type: ApplicationDeploymentType;
    repoState: ApplicationRepositoryState;
    url: string;
    httpUrl?: string;
  };
  // renamed from vhosts
  // transformed: each entry reduced to its fqdn, sorted by domain
  domains: Array<Domain>;
  // renamed from creationDate
  // transformed: converted to an ISO date string
  createdAt: string;
  // renamed from last_deploy
  lastDeployedAt: number;
  // renamed from archived
  isArchived: boolean;
  // renamed from stickySessions
  hasStickySessions: boolean;
  // renamed from homogeneous
  // transformed: inverted boolean
  isZeroDowntimeDeploymentEnabled: boolean;
  // renamed from favourite
  isFavourite: boolean;
  cancelOnPush: boolean;
  // renamed from oauthService, and built from the webhookSecret and webhookUrl payload fields
  oauthApp?: ApplicationOauthApp;
  // renamed from separateBuild
  hasSeparatedBuild: boolean;
  buildFlavor: ProductRuntimeFlavor;
  state: ApplicationState;
  commitId: string;
  appliance: null;
  branch: string;
  // transformed: sorted
  branches?: Array<string>;
  // renamed from forceHttps
  // transformed: converted from ENABLED/DISABLED to a boolean
  shouldForceHttps: boolean;
  // renamed from env
  // transformed: sorted by name
  environment: Array<EnvironmentVariable>;
}

export type ApplicationLifetime = 'REGULAR' | 'MIGRATION' | 'TASK';

export type ApplicationState =
  | 'SHOULD_BE_UP'
  | 'SHOULD_BE_DOWN'
  | 'WANTS_TO_BE_UP'
  | 'MODERATED'
  | 'DEFAULT_OF_PAYMENT';

export type ApplicationDeploymentType = 'GIT' | 'SFTP' | 'FTP';

export type ApplicationRepositoryState = 'CREATING' | 'CREATED' | 'NOT_NEEDED' | 'DELETED';

export type ApplicationOauthApp = ApplicationOauthAppGithub;

export interface ApplicationOauthAppGithub {
  type: 'github';
  secret: string;
  webhookUrl: string;
}
