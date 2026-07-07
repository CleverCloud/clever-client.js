import type { KubernetesCluster } from './kubernetes.types.js';

export interface GetKubernetesClusterCommandInput {
  ownerId: string;
  clusterId: string;
}

export type GetKubernetesClusterCommandOutput = KubernetesCluster;
