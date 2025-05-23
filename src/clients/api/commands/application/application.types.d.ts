import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { Domain } from '../domain/domain.types.js';
import type { ProductRuntimeFlavor, ProductRuntimeVariant } from '../product/product.types.js';

export interface Application {
  id: string;
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
    defaultEnv: Record<string, string>;
    lifetime: ProductRuntimeLifetime;
    instanceAndVersion: string;
  };
  deployment: {
    shutdownable: boolean;
    type: 'GIT' | 'SFTP' | 'FTP';
    repoState: 'CREATING' | 'CREATED' | 'NOT_NEEDED' | 'DELETED';
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
  webhookUrl: string;
  webhookSecret: string;
  separateBuild: boolean;
  buildFlavor: ProductRuntimeFlavor;
  ownerId: string;
  state: 'SHOULD_BE_UP' | 'SHOULD_BE_DOWN' | 'WANTS_TO_BE_UP' | 'MODERATED' | 'DEFAULT_OF_PAYMENT';
  commitId: string;
  appliance: null;
  branch: string;
  // converted from ENABLED/DISABLED to boolean
  forceHttps: boolean;
  // renamed from env
  environment: Array<EnvironmentVariable>;
  deployUrl: string;
}

export type ProductRuntimeLifetime = 'REGULAR' | 'MIGRATION' | 'TASK';
