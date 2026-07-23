import type { ApplicationId } from '../../types/cc-api.types.js';
import type { TcpRedirectionNamespace } from './tcp-redirection.types.js';

/**
 * Identifies the application and the redirection to close on it.
 */
export interface DeleteTcpRedirectionCommandInput extends ApplicationId {
  /** Load balancer pool the port belongs to. */
  namespace: TcpRedirectionNamespace;
  /** Public port to close. */
  port: number;
}
