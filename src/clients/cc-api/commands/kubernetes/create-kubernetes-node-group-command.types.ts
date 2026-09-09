import type { KubernetesNodeGroup, KubernetesNodeGroupCreationPayload } from './kubernetes.types.js';

/**
 * Description of the node group to create, and the cluster it is added to.
 */
export interface CreateKubernetesNodeGroupCommandInput extends KubernetesNodeGroupCreationPayload {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
}

/**
 * The node group that was created, before its nodes have booted.
 */
export type CreateKubernetesNodeGroupCommandOutput = KubernetesNodeGroup;
