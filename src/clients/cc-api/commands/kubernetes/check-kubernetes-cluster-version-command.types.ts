import type { KubernetesClusterVersionCheck } from './kubernetes.types.js';

/**
 * Identifies the cluster whose version is checked.
 */
export interface CheckKubernetesClusterVersionCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
}

/**
 * Where the cluster stands with respect to the Kubernetes versions on offer.
 */
export type CheckKubernetesClusterVersionCommandOutput = KubernetesClusterVersionCheck;
