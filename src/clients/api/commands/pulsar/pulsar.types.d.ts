export interface PulsarInfo extends Omit<PulsarInternalInfo, 'clusterId'> {
  cluster: PulsarClusterInfo;
}

export interface PulsarInternalInfo {
  id: string;
  ownerId: string;
  tenant: string;
  namespace: string;
  clusterId: string;
  token: string;
  creationDate: string;
  askForDeletionDate: string;
  deletionDate: string;
  status: string;
  plan: string;
  coldStorageId: string;
  coldStorageLinked: boolean;
  coldStorageMustBeProvided: boolean;
}

export interface PulsarClusterInfo {
  id: string;
  url: string;
  pulsarPort: number;
  pulsarTlsPort: number;
  webPort: number;
  webTlsPort: number;
  version: string;
  available: boolean;
  zone: string;
  supportColdStorage: boolean;
  supportedPlans: Array<string>;
}
