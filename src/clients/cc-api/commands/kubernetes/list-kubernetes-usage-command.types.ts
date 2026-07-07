import type { KubernetesClusterUsageItem } from './kubernetes.types.js';

export interface ListKubernetesUsageCommandInput {
  ownerId: string;
}

export type ListKubernetesUsageCommandOutput = Array<KubernetesClusterUsageItem>;
