import { normalizeDate, sortBy } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';
import { transformProductRuntimeFlavor } from '../product/product-transform.js';
import type { Application } from './application.types.js';

export function transformApplication(payload: any): Application {
  const application: Application = {
    id: payload.id,
    ownerId: payload.ownerId,
    name: payload.name,
    description: payload.description,
    zone: payload.zone,
    zoneId: payload.zoneId,
    instance: {
      type: payload.instance.type,
      version: payload.instance.version,
      variant: payload.instance.variant,
      minInstances: payload.instance.minInstances,
      maxInstances: payload.instance.maxInstances,
      maxAllowedInstances: payload.instance.maxAllowedInstances,
      minFlavor: transformProductRuntimeFlavor(payload.instance.minFlavor),
      maxFlavor: transformProductRuntimeFlavor(payload.instance.maxFlavor),
      flavors: sortBy(payload.instance.flavors.map(transformProductRuntimeFlavor), 'price'),
      defaultEnvironment: sortBy(toArray(payload.instance.defaultEnv), 'name'),
      lifetime: payload.instance.lifetime,
    },
    deployment: {
      shutdownable: payload.deployment.shutdownable,
      type: payload.deployment.type,
      repoState: payload.deployment.repoState,
      url: payload.deployment.url,
      httpUrl: payload.deployment.httpUrl,
    },
    domains: sortBy(
      payload.vhosts?.map((domain: any) => ({ domain: domain.fqdn })),
      'domain',
    ),
    creationDate: normalizeDate(payload.creationDate),
    lastDeploy: payload.last_deploy,
    archived: payload.archived,
    stickySessions: payload.stickySessions,
    homogeneous: payload.homogeneous,
    favourite: payload.favourite,
    cancelOnPush: payload.cancelOnPush,
    separateBuild: payload.separateBuild,
    buildFlavor: payload.buildFlavor,
    state: payload.state,
    commitId: payload.commitId,
    appliance: payload.appliance,
    branch: payload.branch,
    branches: payload.branches?.sort(),
    forceHttps: payload.forceHttps === 'ENABLED',
    // renamed from env
    environment: sortBy(payload.env, 'name'),
  };

  if (isGithubApplication(payload)) {
    application.oauthApp = {
      type: 'github',
      secret: payload.webhookSecret,
      webhookUrl: payload.webhookUrl,
    };
  }

  return application;
}

export function isGithubApplication(payload: any): boolean {
  return payload.deployment.httpUrl?.startsWith('https://github.com') ?? false;
}
