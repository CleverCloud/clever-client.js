/**
 * Identifies the cluster to delete, and whether to wait for it to be gone.
 */
export interface DeleteKubernetesClusterCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /**
   * If true, wait until the cluster reaches the DELETED status before resolving.
   */
  shouldWait?: boolean;
}
