import type { KubernetesCluster } from './kubernetes.types.js';

/**
 * Identifies the cluster to resume, and whether to wait for it to recover.
 */
export interface ResumeKubernetesClusterCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /**
   * If true, wait until the cluster reaches the ACTIVE status before resolving.
   */
  shouldWaitForActive?: boolean;
}

/**
 * The cluster being resumed. Only guaranteed to be `ACTIVE` when the command was asked to wait.
 */
export type ResumeKubernetesClusterCommandOutput = KubernetesCluster;
