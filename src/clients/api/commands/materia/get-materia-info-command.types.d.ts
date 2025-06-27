import type { AddonId } from '../../types/cc-api.types.js';

export type GetMateriaInfoCommandInput = AddonId;

export interface GetMateriaInfoCommandOutput {
  id: string;
  clusterId: string;
  ownerId: string;
  kind: 'KV';
  plan: 'ALPHA';
  host: string;
  port: number;
  token: string;
  tokenId: string;
  status: 'PROVISIONING' | 'PROVISIONED' | 'TO_DELETE' | 'DELETING' | 'DELETED';
}
