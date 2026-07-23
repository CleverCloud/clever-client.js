/**
 * A load balancer fronting an application or an add-on, and the DNS records pointing at it.
 */
export interface LoadBalancer {
  /** Identifier of the load balancer, of the form `loadBalancer_<uuid>`. */
  id: string;
  /**
   * Name of the load balancer, which identifies the zone and the machine serving it.
   * @renamedFrom `name`
   */
  zone: string;
  /** Identifier of the zone the load balancer runs in. */
  zoneId: string;
  /** DNS records a custom domain must point to in order to be served by this load balancer. */
  dns: {
    /** Domain name a `CNAME` record should target. */
    cname: string;
    /**
     * IP addresses `A` records should target, when a `CNAME` cannot be used.
     * @renamedFrom `a`
     */
    aRecords: Array<string>;
  };
}
