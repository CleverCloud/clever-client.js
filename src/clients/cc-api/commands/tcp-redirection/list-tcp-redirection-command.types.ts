import type { ApplicationId } from '../../types/cc-api.types.js';
import type { TcpRedirection } from './tcp-redirection.types.js';

/**
 * Identifies the application whose redirections are listed. The owner is resolved automatically
 * when omitted.
 */
export type ListTcpRedirectionCommandInput = ApplicationId;

/**
 * The redirections open on the application, in the order the API returned them.
 */
export type ListTcpRedirectionCommandOutput = Array<TcpRedirection>;
