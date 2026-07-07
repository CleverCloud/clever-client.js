import type { KubernetesCluster } from './kubernetes.types.js';

export interface ResumeKubernetesClusterCommandInput {
  ownerId: string;
  clusterId: string;
  /**
   * If true, wait until the cluster reaches the ACTIVE status before resolving.
   */
  waitForActive?: boolean;
}

export type ResumeKubernetesClusterCommandOutput = KubernetesCluster;
