import type { KubernetesCluster, KubernetesClusterFeatures } from './kubernetes.types.js';

export interface UpdateKubernetesClusterCommandInput {
  ownerId: string;
  clusterId: string;
  name?: string;
  tags?: Array<string>;
  description?: string;
  features?: KubernetesClusterFeatures;
}

export type UpdateKubernetesClusterCommandOutput = KubernetesCluster;
