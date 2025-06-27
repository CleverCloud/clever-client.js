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
  creationDate: string;
  // renamed from ask_for_deletion_date
  askForDeletionDate?: string;
  // renamed from deletion_date
  deletionDate?: string;
  status: 'ACTIVE' | 'TO_DELETE' | 'NAMESPACE_DELETED' | 'COLD_STORAGE_DELETED' | 'DELETED';
  plan: PulsarPlan;
  // renamed from cold_storage_id
  coldStorageId?: string;
  // renamed from cold_storage_linked
  coldStorageLinked: boolean;
  // renamed from cold_storage_must_be_provided
  coldStorageMustBeProvided: boolean;
}

export interface GetPulsarClusterInnerCommandInput {
  clusterId: string;
}

export interface GetPulsarClusterInnerCommandOutput {
  id: string;
  url: string;
  // renamed from pulsar_port
  pulsarPort: number;
  // renamed from pulsar_tls_port
  pulsarTlsPort?: number;
  // renamed from web_port
  webPort?: number;
  // renamed from web_tls_port
  webTlsPort?: number;
  version: string;
  available: boolean;
  zone: string;
  // renamed from support_cold_storage
  supportColdStorage: boolean;
  // renamed from supported_plans
  supportedPlans: Array<PulsarPlan>;
}

export type PulsarPlan =
  | 'BETA'
  | 'ORGANISATION_LOGS'
  | 'ORGANISATION_ACCESS_LOGS'
  | 'ORGANISATION_AUDIT_LOGS'
  | 'ORGANISATION_ACTIONS';
