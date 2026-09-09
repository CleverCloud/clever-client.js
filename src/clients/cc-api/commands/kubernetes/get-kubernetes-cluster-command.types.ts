import type { KubernetesCluster } from './kubernetes.types.js';

/**
 * Identifies the cluster to retrieve.
 */
export interface GetKubernetesClusterCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
}

/**
 * The requested cluster.
 */
export type GetKubernetesClusterCommandOutput = KubernetesCluster;
