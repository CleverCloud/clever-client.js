/**
 * Identifies the cluster whose kubeconfig the URL points to.
 */
export interface GetKubernetesKubeconfigPresignedUrlCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
}

/**
 * The self-authenticated download URL.
 */
export interface GetKubernetesKubeconfigPresignedUrlCommandOutput {
  /** URL the kubeconfig can be downloaded from, token included. */
  url: string;
}
