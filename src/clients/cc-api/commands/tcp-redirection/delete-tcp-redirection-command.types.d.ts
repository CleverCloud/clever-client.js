import { ApplicationId } from '../../types/cc-api.types.js';
import type { TcpRedirectionNamespace } from './tcp-redirection.types.js';

export interface DeleteTcpRedirectionCommandInput extends ApplicationId {
  namespace: TcpRedirectionNamespace;
  port: number;
}
