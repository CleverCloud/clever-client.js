/**
 * The details of an Elasticsearch add-on: the cluster it runs, the credentials to reach its Elasticsearch, Kibana
 * and APM endpoints, and the optional services and features it was provisioned with.
 */
export interface ElasticsearchInfo {
  /** Internal identifier the Elasticsearch add-on provider assigns to the add-on (a UUID). Not the underlying Elasticsearch cluster id. */
  id: string;
  /**
   * Identifier of the organisation owning the add-on, absent when the backend has none recorded.
   * @renamedFrom `owner_id`
   */
  ownerId?: string;
  /** Version of Elasticsearch the cluster runs. */
  version: string;
  /**
   * Identifier of the add-on the cluster was provisioned for.
   * @renamedFrom `app_id`
   */
  addonId: string;
  /** Plan the add-on was provisioned with. */
  plan: string;
  /** Name of the zone the cluster is hosted in. */
  zone: string;
  /** Where the cluster is reachable and the credentials to authenticate against its endpoints. */
  config: {
    /** Host name of the Elasticsearch endpoint. */
    host: string;
    /** User name to authenticate against Elasticsearch. */
    user: string;
    /** Password to authenticate against Elasticsearch. */
    password: string;
    /**
     * User name to authenticate against the APM server.
     * @renamedFrom `apm_user`
     */
    apmUser: string;
    /**
     * Password to authenticate against the APM server.
     * @renamedFrom `apm_password`
     */
    apmPassword: string;
    /**
     * Token APM agents use to send data to the APM server.
     * @renamedFrom `apm_auth_token`
     */
    apmAuthToken: string;
    /**
     * User name to authenticate against Kibana.
     * @renamedFrom `kibana_user`
     */
    kibanaUser: string;
    /**
     * Password to authenticate against Kibana.
     * @renamedFrom `kibana_password`
     */
    kibanaPassword: string;
  };
  /** Where the backups of the add-on can be found. */
  backups: {
    /**
     * URL listing the Kibana snapshots taken for the add-on, absent when none is available.
     * @renamedFrom `kibana_snapshots_url`
     */
    kibanaSnapshotsUrl?: string;
  };
  /**
   * Identifier of the application running Kibana for this add-on, absent when Kibana is not enabled.
   * @renamedFrom `kibana_application`
   */
  kibanaApplication?: string;
  /**
   * Identifier of the application running the APM server for this add-on, absent when APM is not enabled.
   * @renamedFrom `apm_application`
   */
  apmApplication?: string;
  /**
   * Optional services (Kibana, APM, ...) that can run alongside the cluster, and whether they do. Each entry has its
   * `enabled` renamed to `isEnabled`, and the list is sorted by name.
   */
  services: Array<{
    /** Name of the service. */
    name: string;
    /** Whether the service runs for this add-on. */
    isEnabled: boolean;
  }>;
  /**
   * Optional cluster features, and whether they are turned on. Each entry has its `enabled` renamed to `isEnabled`,
   * and the list is sorted by name.
   */
  features: Array<{
    /** Name of the feature. */
    name: string;
    /** Whether the feature is turned on for this add-on. */
    isEnabled: boolean;
  }>;
}
