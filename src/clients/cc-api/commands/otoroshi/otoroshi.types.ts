/**
 * An Otoroshi add-on: the managed HTTP reverse proxy and API gateway, with how to reach it, its
 * admin API credentials and the platform resources it is built on.
 */
export interface OtoroshiInfo {
  /**
   * Provider-side identifier of the Otoroshi instance.
   * @renamedFrom `resourceId`
   */
  id: string;
  /** Identifier of the add-on the instance belongs to. */
  addonId: string;
  /** Display name of the add-on. */
  name: string;
  /** Identifier of the user or organisation owning the add-on. */
  ownerId: string;
  /** Plan the instance runs on. */
  plan: string;
  /** Otoroshi version currently installed. */
  version: string;
  /** Java version Otoroshi runs on. */
  javaVersion: string;
  /** URL of the Otoroshi administration console. */
  accessUrl: string;
  /** Every version the instance can be moved to. */
  availableVersions: Array<string>;
  /** The platform resources the instance is assembled from. */
  resources: {
    /** Identifier of the application serving Otoroshi. */
    entrypoint: string;
    /** Identifier of the Redis© add-on holding the gateway configuration. */
    redisId: string;
    /** Identifier of the Pulsar add-on events are pushed to, on the instances that have one. */
    pulsarId: string | null;
    /** Identifier of the Elasticsearch add-on events are indexed into, on the instances that have one. */
    elasticId: string | null;
  };
  /** Optional capabilities turned on for this instance. */
  features: {
    /** The network group the instance sits behind, or `null` when it is publicly reachable. */
    networkGroup: {
      /** Identifier of the network group. */
      id: string;
    } | null;
  };
  /** Credentials and endpoints of the Otoroshi admin API. */
  api: {
    /** Base URL of the admin API. */
    url: string;
    /** Client identifier to authenticate the admin API calls with. */
    user: string;
    /** Client secret to authenticate the admin API calls with. */
    secret: string;
    /** URL of the OpenAPI document describing the admin API. */
    openapi: string;
    /** URL of the Swagger UI browsing that document. */
    swaggerUrl: string;
  };
  /** Credentials of the first administrator, handed over once at provisioning time. */
  initialCredentials: {
    /** Administrator user name. */
    user: string;
    /** Administrator password. */
    password: string;
  };
}
