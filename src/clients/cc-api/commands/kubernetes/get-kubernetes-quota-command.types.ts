import type { KubernetesQuota } from './kubernetes.types.js';

export interface GetKubernetesQuotaCommandInput {
  ownerId: string;
}

export type GetKubernetesQuotaCommandOutput = KubernetesQuota;
