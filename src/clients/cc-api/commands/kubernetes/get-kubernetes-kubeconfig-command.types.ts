import type { KubernetesKubeConfigType } from './kubernetes.types.js';

/**
 * Identifies the cluster whose kubeconfig is retrieved, and how it should reach the API server.
 */
export interface GetKubernetesKubeconfigCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /**
   * How the kubeconfig should reach the API server. Defaults to `LOADBALANCER` server-side.
   * @sentAs `type`
   */
  kubeConfigType?: KubernetesKubeConfigType;
}

/**
 * The kubeconfig itself, as a YAML document.
 */
export type GetKubernetesKubeconfigCommandOutput = string;
