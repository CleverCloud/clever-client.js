export type GetWarpTokenCommandInput = GetWarpTokenCommandInputOwner | GetWarpTokenCommandInputResource;

export interface GetWarpTokenCommandInputOwner extends GetWarpTokenCommandInputBase {
  ownerId: string;
}

export interface GetWarpTokenCommandInputResource extends GetWarpTokenCommandInputBase {
  ownerId?: string;
  applicationId: string;
}

export interface GetWarpTokenCommandInputBase {
  applications?: Array<WarpTokenApplication>;
  ttl?: string;
}

export type WarpTokenApplication = 'metrics' | 'metrics.accesslogs' | 'addon-api-cellar';

export interface GetWarpTokenCommandOutput {
  token: string;
  // transformed: converted to an ISO date string
  expiresAt: string;
  // transformed: converted to an ISO date string
  createdAt: string;
  scope: 'READ';
  applications: Array<WarpTokenApplication>;
}
