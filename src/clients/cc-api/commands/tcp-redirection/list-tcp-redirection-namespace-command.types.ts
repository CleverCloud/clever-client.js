import type { TcpRedirectionNamespace } from './tcp-redirection.types.js';

/**
 * Identifies the organisation whose load balancer pools are listed.
 */
export interface ListTcpRedirectionNamespaceCommandInput {
  /** Identifier of the user or organisation. */
  ownerId: string;
}

/**
 * The pools available to the organisation, each wrapped in an object as the API returns them.
 */
export type ListTcpRedirectionNamespaceCommandOutput = Array<{
  /** Name of the pool, usable as the `namespace` of a new redirection. */
  namespace: TcpRedirectionNamespace;
}>;
