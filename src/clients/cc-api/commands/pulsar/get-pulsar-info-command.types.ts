import type { PulsarInfo, PulsarPlan } from './pulsar.types.js';

export interface GetPulsarInfoCommandInput {
  addonId: string;
}

export interface GetPulsarInfoCommandOutput extends Omit<GetPulsarInfoInnerCommandOutput, 'clusterId'> {
  cluster: GetPulsarClusterInnerCommandOutput;
}

export interface GetPulsarInfoInnerCommandOutput {
  id: string;
  tenant: string;
  namespace: string;
  // renamed from cluster_id
  clusterId: string;
  token: string;
  // renamed from creation_date
  // transformed: converted to an ISO date string
  createdAt: string;
  // renamed from ask_for_deletion_date
  // transformed: converted to an ISO date string
  askForDeletionAt?: string;
  // renamed from deletion_date
  // transformed: converted to an ISO date string
  deletedAt?: string;
  status: 'ACTIVE' | 'TO_DELETE' | 'NAMESPACE_DELETED' | 'COLD_STORAGE_DELETED' | 'DELETED';
  plan: PulsarPlan;
  // renamed from cold_storage_id
  coldStorageId?: string;
  // renamed from cold_storage_linked
  isColdStorageLinked: boolean;
  // renamed from cold_storage_must_be_provided
  isColdStorageMustBeProvided: boolean;
}

export interface GetPulsarClusterInnerCommandInput {
  clusterId: string;
}

export type GetPulsarClusterInnerCommandOutput = PulsarInfo;
