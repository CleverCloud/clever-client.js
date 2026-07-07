import type { KubernetesCluster, KubernetesClusterStatus } from './kubernetes.types.js';

export interface ListKubernetesClusterCommandInput {
  ownerId: string;
  status?: Array<KubernetesClusterStatus>;
}

export type ListKubernetesClusterCommandOutput = Array<KubernetesCluster>;
