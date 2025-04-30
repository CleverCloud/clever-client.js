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
    flavors: Array<ProductRuntimeFlavor>;
    // renamed from defaultEnv, and converted from Record<string, string>
    defaultEnvironment: Array<EnvironmentVariable>;
    lifetime: ApplicationLifetime;
  };
  deployment: {
    shutdownable: boolean;
    type: ApplicationDeploymentType;
    repoState: ApplicationRepositoryState;
    url: string;
    httpUrl: string;
  };
  // renamed from vhosts
  domains: Array<Domain>;
  // converted from number to date iso string
  creationDate: string;
  // renamed from last_deploy
  lastDeploy: number;
  archived: boolean;
  stickySessions: boolean;
  homogeneous: boolean;
  favourite: boolean;
  cancelOnPush: boolean;
  oauthApp?: ApplicationOauthApp;
  separateBuild: boolean;
  buildFlavor: ProductRuntimeFlavor;
  state: ApplicationState;
  commitId: string;
  appliance: null;
  branch: string;
  branches?: Array<string>;
  // converted from ENABLED/DISABLED to boolean
  forceHttps: boolean;
  // renamed from env
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
