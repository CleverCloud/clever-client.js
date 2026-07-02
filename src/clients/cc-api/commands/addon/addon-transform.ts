import { normalizeDate } from '../../../../lib/utils.js';
import { transformAddonProviderPlan } from '../addon-provider/addon-provider-transform.js';
import type { Addon } from './addon.types.js';
import type { GetAddonSsoCommandOutput } from './get-addon-sso-command.types.js';

export function transformAddon(payload: any): Addon {
  return {
    id: payload.id,
    name: payload.name,
    realId: payload.realId,
    zone: payload.region,
    zoneId: payload.zoneId,
    provider: payload.provider,
    plan: transformAddonProviderPlan(payload.plan),
    creationDate: normalizeDate(payload.creationDate)!,
    configKeys: payload.configKeys.sort(),
  };
}

export function transformAddonSso(payload: any): GetAddonSsoCommandOutput {
  return {
    url: payload.url,
    id: payload.id,
    timestamp: payload.timestamp,
    token: payload.token,
    signature: payload.signature,
    email: payload.email,
    name: payload.name,
    userId: payload.user_id,
    userInfoSignature: payload.userinfo_signature,
    navData: payload['nav-data'],
  };
}
