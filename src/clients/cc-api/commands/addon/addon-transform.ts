import { normalizeDate } from '../../../../lib/utils.js';
import { transformAddonProviderPlan } from '../addon-provider/addon-provider-transform.js';
import type { Addon } from './addon.types.js';
import type { GetAddonSsoCommandOutput } from './get-addon-sso-command.types.js';
import type { AddonInstance } from './list-addon-instance-command.types.js';

export function transformAddon(payload: any): Addon {
  return {
    id: payload.id,
    name: payload.name,
    realId: payload.realId,
    zone: payload.region,
    zoneId: payload.zoneId,
    provider: payload.provider,
    plan: transformAddonProviderPlan(payload.plan),
    createdAt: normalizeDate(payload.creationDate)!,
    configKeys: payload.configKeys.sort(),
  };
}

export function transformAddonInstance(payload: any): AddonInstance {
  return {
    id: payload.id,
    realId: payload.appId,
    ip: payload.ip,
    port: payload.appPort,
    state: payload.state,
    flavor: payload.flavor,
    commitId: payload.commit,
    deployNumber: payload.deployNumber ?? undefined,
    deployId: payload.deployId,
    instanceNumber: payload.instanceNumber,
    displayName: payload.displayName,
    createdAt: normalizeDate(payload.creationDate)!,
  };
}

export function transformAddonSso(payload: any): GetAddonSsoCommandOutput {
  return {
    url: payload.url,
    id: payload.id,
    timestamp: payload.timestamp,
    token: payload.token,
    signature: payload.signature,
    emailAddress: payload.email,
    name: payload.name,
    userId: payload.user_id,
    userInfoSignature: payload.userinfo_signature,
    navData: payload['nav-data'],
  };
}
