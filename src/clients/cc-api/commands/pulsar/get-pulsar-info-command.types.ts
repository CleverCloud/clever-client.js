import type { PulsarInfo, PulsarPlan } from './pulsar.types.js';

/**
 * Identifies the Pulsar add-on to retrieve the details of.
 */
export interface GetPulsarInfoCommandInput {
  /** Identifier of the Pulsar add-on. */
  addonId: string;
}

/**
 * The details of the Pulsar add-on, with the cluster hosting it inlined in place of its bare id.
 */
export interface GetPulsarInfoCommandOutput extends Omit<GetPulsarInfoInnerCommandOutput, 'clusterId'> {
  /** The Pulsar cluster the add-on is hosted on. */
  cluster: GetPulsarClusterInnerCommandOutput;
}

/**
 * The Pulsar add-on as the API returns it, referring to its cluster by id.
 */
export interface GetPulsarInfoInnerCommandOutput {
  /** Identifier of the Pulsar add-on. */
  id: string;
  /** Pulsar tenant allocated to the add-on. */
  tenant: string;
  /** Pulsar namespace allocated to the add-on, inside its tenant. */
  namespace: string;
  /**
   * Identifier of the Pulsar cluster hosting the add-on.
   * @renamedFrom `cluster_id`
   */
  clusterId: string;
  /** Token to authenticate against Pulsar for this namespace. */
  token: string;
  /**
   * When the add-on was created.
   * @renamedFrom `creation_date`
   * @converted to an ISO date string
   */
  createdAt: string;
  /**
   * When the deletion of the add-on was requested.
   * @renamedFrom `ask_for_deletion_date`
   * @converted to an ISO date string
   */
  askForDeletionAt?: string;
  /**
   * When the add-on was deleted.
   * @renamedFrom `deletion_date`
   * @converted to an ISO date string
   */
  deletedAt?: string;
  /** Where the add-on stands in its lifecycle, from active to fully deleted. */
  status: 'ACTIVE' | 'TO_DELETE' | 'NAMESPACE_DELETED' | 'COLD_STORAGE_DELETED' | 'DELETED';
  /** Plan the add-on was provisioned with. */
  plan: PulsarPlan;
  /**
   * Identifier of the Cellar add-on old messages are offloaded to.
   * @renamedFrom `cold_storage_id`
   */
  coldStorageId?: string;
  /**
   * Whether a cold storage is currently linked to the add-on.
   * @renamedFrom `cold_storage_linked`
   */
  isColdStorageLinked: boolean;
  /**
   * Whether a cold storage must be provided for the add-on to work.
   * @renamedFrom `cold_storage_must_be_provided`
   */
  isColdStorageMustBeProvided: boolean;
}

/**
 * Identifies the Pulsar cluster to retrieve.
 */
export interface GetPulsarClusterInnerCommandInput {
  /** Identifier of the Pulsar cluster. */
  clusterId: string;
}

/**
 * The requested Pulsar cluster.
 */
export type GetPulsarClusterInnerCommandOutput = PulsarInfo;
