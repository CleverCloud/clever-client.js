export interface GetWarpTokenCommandInput {
  ownerId: string;
  tokenKind: 'METRICS' | 'ACCESS_LOGS';
}

export type GetWarpTokenCommandOutput = string;
