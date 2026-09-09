/**
 * A public TCP port routed to an application, for protocols the HTTP reverse proxy cannot carry.
 */
export interface TcpRedirection {
  /** Load balancer pool the port was taken from. */
  namespace: TcpRedirectionNamespace;
  /** Public port traffic arrives on. Assigned by the platform, not chosen. */
  port: number;
}

/**
 * A pool of load balancers TCP ports can be taken from. `default` is the shared pool, `cleverapps`
 * the one backing the `cleverapps.io` domains; organisations with dedicated load balancers get
 * their own named pools.
 */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- the literals document the well-known namespaces while still allowing any string
export type TcpRedirectionNamespace = 'default' | 'cleverapps' | string;
