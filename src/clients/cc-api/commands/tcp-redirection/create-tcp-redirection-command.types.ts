import type { ApplicationId } from '../../types/cc-api.types.ts';
import type { TcpRedirection, TcpRedirectionNamespace } from './tcp-redirection.types.ts';

/**
 * Identifies the application to open a port on, and the pool to take it from.
 */
export interface CreateTcpRedirectionCommandInput extends ApplicationId {
  /** Load balancer pool to take the port from. Defaults to `default`. */
  namespace?: TcpRedirectionNamespace;
}

/**
 * The redirection that was opened, with the port the platform assigned.
 */
export type CreateTcpRedirectionCommandOutput = TcpRedirection;
