import type { KubernetesNodeGroup } from './kubernetes.types.js';

/**
 * Identifies the node group to retrieve.
 */
export interface GetKubernetesNodeGroupCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /** Identifier of the node group. */
  nodeGroupId: string;
}

/**
 * The requested node group.
 */
export type GetKubernetesNodeGroupCommandOutput = KubernetesNodeGroup;
