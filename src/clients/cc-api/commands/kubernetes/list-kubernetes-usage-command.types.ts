import type { KubernetesClusterUsageItem } from './kubernetes.types.js';

/**
 * Identifies the owner whose usage is listed.
 */
export interface ListKubernetesUsageCommandInput {
  /** Identifier of the user or organisation. */
  ownerId: string;
}

/**
 * The usage records, in the order the API returned them.
 */
export type ListKubernetesUsageCommandOutput = Array<KubernetesClusterUsageItem>;
