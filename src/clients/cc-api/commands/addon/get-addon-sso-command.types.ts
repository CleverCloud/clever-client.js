import type { AddonId } from '../../types/cc-api.types.js';

export type GetAddonSsoCommandInput = AddonId;

export interface GetAddonSsoCommandOutput {
  url: string;
  id: string;
  timestamp: number;
  token: string;
  signature: string;
  email: string;
  // renamed from user_id
  userId: string;
  // renamed from userinfo_signature
  userInfoSignature: string;
  name: string;
  // renamed from nav-data
  navData: string;
}
