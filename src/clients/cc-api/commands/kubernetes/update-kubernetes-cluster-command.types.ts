import type { KubernetesCluster, KubernetesClusterFeatures } from './kubernetes.types.js';

/**
 * Identifies the cluster to update, and what to change on it.
 */
export interface UpdateKubernetesClusterCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /** New display name of the cluster. */
  name?: string;
  /** New set of labels attached to the cluster. Replaces the previous one. */
  tags?: Array<string>;
  /** New free text description of the cluster. */
  description?: string;
  /** Optional capabilities to turn on or off. */
  features?: KubernetesClusterFeatures;
}

/**
 * The cluster as it stands after the update.
 */
export type UpdateKubernetesClusterCommandOutput = KubernetesCluster;
