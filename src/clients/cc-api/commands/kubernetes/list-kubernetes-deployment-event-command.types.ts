import type { KubernetesDeploymentEvent } from './kubernetes.types.js';

export interface ListKubernetesDeploymentEventCommandInput {
  ownerId: string;
  clusterId: string;
  limit?: number;
}

export type ListKubernetesDeploymentEventCommandOutput = Array<KubernetesDeploymentEvent>;
