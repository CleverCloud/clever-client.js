import type { ApplicationId } from '../../types/cc-api.types.ts';
import type { TcpRedirection } from './tcp-redirection.types.ts';

/**
 * Identifies the application whose redirections are listed. The owner is resolved automatically
 * when omitted.
 */
export type ListTcpRedirectionCommandInput = ApplicationId;

/**
 * The redirections open on the application, in the order the API returned them.
 */
export type ListTcpRedirectionCommandOutput = Array<TcpRedirection>;
