import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { Application, ApplicationLifetime } from './application.types.js';

export interface CreateApplicationCommandInput {
  applianceId?: string;
  archived?: boolean;
  branch: string;
  buildFlavor: string;
  cancelOnPush?: boolean;
  deploy: string;
  description?: string;
  // renamed from env and converted from Record<string, string>
  environment?: Array<EnvironmentVariable>;
  favourite?: boolean;
  // converted from ENABLED|DISABLED to boolean
  forceHttps?: boolean;
  homogeneous?: boolean;
  instance: ApplicationInstance | ApplicationInstanceSlug;
  instanceLifetime?: ApplicationLifetime;
  maxFlavor: string;
  maxInstances: number;
  minFlavor: string;
  minInstances: number;
  name: string;
  oauthApp?: ApplicationOauthApp;
  ownerId: string;
  separateBuild?: boolean;
  shutdownable?: boolean;
  stickySessions?: boolean;
  tags?: Array<string>;
  zone: string;
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
