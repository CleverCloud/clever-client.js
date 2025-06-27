/**
 * @import { Application } from './application.types.js';
 */

import { normalizeDate } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';
import { transformDomain } from '../domain/domain-transform.js';
import { transformProductRuntimeFlavor } from '../product/product-transform.js';

/**
 * @param {any} payload
 * @returns {Application}
 */
export function transformApplication(payload) {
  /** @type {Application} */
  const application = {
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
      flavors: payload.instance.flavors.map(transformProductRuntimeFlavor),
      defaultEnvironment: toArray(payload.instance.defaultEnv),
      lifetime: payload.instance.lifetime,
    },
    deployment: {
      shutdownable: payload.deployment.shutdownable,
      type: payload.deployment.type,
      repoState: payload.deployment.repoState,
      url: payload.deployment.url,
      httpUrl: payload.deployment.httpUrl,
    },
    domains: payload.vhosts?.map(transformDomain),
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
    branches: payload.branches,
    forceHttps: payload.forceHttps === 'ENABLED',
    // renamed from env
    environment: payload.env,
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

/**
 * @param {any} payload
 * @returns {boolean}
 */
export function isGithubApplication(payload) {
  return payload.deployment.httpUrl.startsWith('https://github.com');
}
