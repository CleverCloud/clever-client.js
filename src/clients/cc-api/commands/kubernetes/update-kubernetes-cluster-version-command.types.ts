import type { KubernetesCluster } from './kubernetes.types.js';

export interface UpdateKubernetesClusterVersionCommandInput {
  ownerId: string;
  clusterId: string;
  targetVersion: string;
  /**
   * If true, wait until the cluster reaches the ACTIVE status before resolving.
   */
  waitForActive?: boolean;
}

export type UpdateKubernetesClusterVersionCommandOutput = KubernetesCluster;
