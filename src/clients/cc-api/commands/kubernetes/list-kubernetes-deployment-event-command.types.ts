import type { KubernetesDeploymentEvent } from './kubernetes.types.js';

/**
 * Identifies the cluster whose deployment events are listed, and how many of them to return.
 */
export interface ListKubernetesDeploymentEventCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /** How many events to return. Defaults to 50 server-side, and is clamped between 1 and 1000. */
  limit?: number;
}

/**
 * The events, most recent first.
 */
export type ListKubernetesDeploymentEventCommandOutput = Array<KubernetesDeploymentEvent>;
