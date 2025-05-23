import type { Application, ProductRuntimeLifetime } from './application.types.js';

export interface CreateApplicationCommandInput {
  applianceId?: string;
  archived?: boolean;
  branch: string;
  buildFlavor: string;
  cancelOnPush?: boolean;
  deploy: string;
  description?: string;
  env?: Record<string, string>;
  favourite?: boolean;
  // converted from ENABLED|DISABLED to boolean
  forceHttps?: boolean;
  homogeneous?: boolean;
  instance: ApplicationInstance | ApplicationInstanceSlug;
  instanceLifetime?: ProductRuntimeLifetime;
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

export type ApplicationOauthApp = ApplicationOauthAppGithub;

export interface ApplicationOauthAppGithub {
  type: 'github';
  id?: string;
  owner: string;
  name: string;
}

/**
 * @internal
 */
export interface CreateApplicationInternalCommandInput extends Omit<CreateApplicationCommandInput, 'instance'> {
  instance: ApplicationInstance;
}
