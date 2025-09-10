import { ApplicationId } from '../../types/cc-api.types.js';
import type { TcpRedirection } from './tcp-redirection.types.js';

export interface ListTcpRedirectionCommandInput extends ApplicationId {}

export type ListTcpRedirectionCommandOutput = Array<TcpRedirection>;
