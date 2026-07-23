/**
 * Identifies the node group to delete.
 */
export interface DeleteKubernetesNodeGroupCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /** Identifier of the node group. */
  nodeGroupId: string;
}
