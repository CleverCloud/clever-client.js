import type { ApplicationId } from '../../types/cc-api.types.js';
import type { TcpRedirection } from './tcp-redirection.types.js';

export type ListTcpRedirectionCommandInput = ApplicationId;

export type ListTcpRedirectionCommandOutput = Array<TcpRedirection>;
