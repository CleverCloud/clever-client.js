/**
 * A Pulsar cluster: the shared Apache Pulsar deployment that Pulsar add-ons get a tenant and a namespace on.
 */
export interface PulsarInfo {
  /** Identifier of the cluster. */
  id: string;
  /** Host name the cluster is reachable at. */
  url: string;
  /**
   * Port serving the Pulsar binary protocol.
   * @renamedFrom `pulsar_port`
   */
  pulsarPort: number;
  /**
   * Port serving the Pulsar binary protocol over TLS.
   * @renamedFrom `pulsar_tls_port`
   */
  pulsarTlsPort?: number;
  /**
   * Port serving the Pulsar HTTP admin API.
   * @renamedFrom `web_port`
   */
  webPort?: number;
  /**
   * Port serving the Pulsar HTTP admin API over TLS.
   * @renamedFrom `web_tls_port`
   */
  webTlsPort?: number;
  /** Version of Pulsar the cluster runs. */
  version: string;
  /**
   * Whether the cluster accepts new add-ons.
   * @renamedFrom `available`
   */
  isAvailable: boolean;
  /**
   * Name of the zone the cluster is hosted in.
   * @converted lowercased
   */
  zone: string;
  /**
   * Whether the cluster can offload old messages to a cold storage.
   * @renamedFrom `support_cold_storage`
   */
  isColdStorageSupported: boolean;
  /**
   * Plans that can be provisioned on this cluster.
   * @renamedFrom `supported_plans`
   */
  supportedPlans: Array<PulsarPlan>;
}

/**
 * The plans a Pulsar add-on can be provisioned with. Apart from `BETA`, which is the plan offered to customers, they
 * back the platform data streams an organisation can subscribe to.
 */
export type PulsarPlan =
  | 'BETA'
  | 'ORGANISATION_LOGS'
  | 'ORGANISATION_ACCESS_LOGS'
  | 'ORGANISATION_AUDIT_LOGS'
  | 'ORGANISATION_ACTIONS';
