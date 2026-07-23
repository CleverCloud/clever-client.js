import type { KubernetesQuota } from './kubernetes.types.js';

/**
 * Identifies the owner whose quota is read.
 */
export interface GetKubernetesQuotaCommandInput {
  /** Identifier of the user or organisation. */
  ownerId: string;
}

/**
 * The limits applied to that owner.
 */
export type GetKubernetesQuotaCommandOutput = KubernetesQuota;
