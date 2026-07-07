import type { KubernetesKubeConfigType } from './kubernetes.types.js';

export interface GetKubernetesKubeconfigCommandInput {
  ownerId: string;
  clusterId: string;
  // renamed from the wire's generic `type` query param, still sent on the wire as `?type=`
  kubeConfigType?: KubernetesKubeConfigType;
}

export type GetKubernetesKubeconfigCommandOutput = string;
