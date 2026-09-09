import type { KubernetesCluster } from './kubernetes.types.js';

/**
 * Identifies the cluster to upgrade, the version to move it to, and whether to wait.
 */
export interface UpdateKubernetesClusterVersionCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /** Kubernetes version to upgrade the control plane to. */
  targetVersion: string;
  /**
   * If true, wait until the cluster reaches the ACTIVE status before resolving.
   */
  shouldWaitForActive?: boolean;
}

/**
 * The cluster being upgraded. Only guaranteed to be `ACTIVE` when the command was asked to wait.
 */
export type UpdateKubernetesClusterVersionCommandOutput = KubernetesCluster;
