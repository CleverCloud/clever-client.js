export interface MateriaInfo {
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
