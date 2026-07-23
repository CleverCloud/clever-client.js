export interface DeleteKubernetesClusterCommandInput {
  ownerId: string;
  clusterId: string;
  /**
   * If true, wait until the cluster reaches the DELETED status before resolving.
   */
  shouldWait?: boolean;
}
