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
      canShutdown: payload.deployment.shutdownable,
      type: payload.deployment.type,
      repoState: payload.deployment.repoState,
      url: payload.deployment.url,
      httpUrl: payload.deployment.httpUrl,
    },
    domains: sortBy(
      payload.vhosts?.map((domain: any) => ({ domain: domain.fqdn })),
      'domain',
    ),
    createdAt: normalizeDate(payload.creationDate)!,
    lastDeployedAt: payload.last_deploy,
    isArchived: payload.archived,
    hasStickySessions: payload.stickySessions,
    isZeroDowntimeDeploymentEnabled: !payload.homogeneous,
    isFavourite: payload.favourite,
    cancelOnPush: payload.cancelOnPush,
    hasSeparatedBuild: payload.separateBuild,
    buildFlavor: payload.buildFlavor,
    state: payload.state,
    commitId: payload.commitId,
    appliance: payload.appliance,
    branch: payload.branch,
    branches: payload.branches?.sort(),
    shouldForceHttps: payload.forceHttps === 'ENABLED',
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
