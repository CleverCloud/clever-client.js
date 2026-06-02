import { normalizeDate } from '../../../../lib/utils.js';
import type { GetWarpTokenCommandOutput } from './get-warp-token-command.types.js';

export function transformWarpToken(response: any): GetWarpTokenCommandOutput {
  return {
    token: response.token,
    expiresAt: normalizeDate(response.expiresAt),
    createdAt: normalizeDate(response.createdAt),
    scope: response.scope,
    applications: response.applications,
  };
}
