import type { KubernetesNodeGroup, KubernetesNodeGroupStatus } from './kubernetes.types.js';

/**
 * Identifies the cluster whose node groups are listed, and which of them to keep.
 */
export interface ListKubernetesNodeGroupCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /** Only return the node groups in one of these statuses. Omit it to get them all. */
  status?: Array<KubernetesNodeGroupStatus>;
}

/**
 * The node groups, in the order the API returned them.
 */
export type ListKubernetesNodeGroupCommandOutput = Array<KubernetesNodeGroup>;
