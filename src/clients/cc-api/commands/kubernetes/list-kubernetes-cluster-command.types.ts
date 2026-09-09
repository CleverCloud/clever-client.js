import type { KubernetesCluster, KubernetesClusterStatus } from './kubernetes.types.js';

/**
 * Identifies the organisation whose clusters are listed, and which of them to keep.
 */
export interface ListKubernetesClusterCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Only return the clusters in one of these statuses. Omit it to get them all. */
  status?: Array<KubernetesClusterStatus>;
}

/**
 * The clusters, in the order the API returned them.
 */
export type ListKubernetesClusterCommandOutput = Array<KubernetesCluster>;
