import type { KubernetesNodeGroup } from './kubernetes.types.js';

/**
 * Identifies the node group to resume.
 */
export interface ResumeKubernetesNodeGroupCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /** Identifier of the node group. */
  nodeGroupId: string;
}

/**
 * The node group being resumed, in the transitional state it starts its recovery in.
 */
export type ResumeKubernetesNodeGroupCommandOutput = KubernetesNodeGroup;
