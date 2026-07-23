import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { Application, ApplicationLifetime } from './application.types.js';

export interface CreateApplicationCommandInput {
  applianceId?: string;
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
  instance: ApplicationInstance | ApplicationInstanceSlug;
  instanceLifetime?: ApplicationLifetime;
  maxFlavor?: string;
  maxInstances?: number;
  minFlavor: string;
  minInstances?: number;
  name: string;
  oauthApp?: ApplicationOauthApp;
  ownerId: string;
  publicGitRepositoryUrl?: string;
  hasSeparatedBuild?: boolean;
  canShutdown?: boolean;
  hasStickySessions?: boolean;
  tags?: Array<string>;
  zone?: string;
}

export type CreateApplicationCommandOutput = Application;

export interface ApplicationInstanceSlug {
  slug: string;
}

export interface ApplicationInstance {
  type: string;
  version: string;
  variant: string;
}

type ApplicationOauthApp = ApplicationOauthAppGithub;

interface ApplicationOauthAppGithub {
  type: 'github';
  id: string;
}

export interface CreateApplicationInnerCommandInput extends Omit<CreateApplicationCommandInput, 'instance'> {
  instance: ApplicationInstance;
}
