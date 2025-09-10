import { ApplicationId } from '../../types/cc-api.types.js';
import type { TcpRedirection, TcpRedirectionNamespace } from './tcp-redirection.types.js';

export interface CreateTcpRedirectionCommandInput extends ApplicationId {
  namespace?: TcpRedirectionNamespace;
}

export type CreateTcpRedirectionCommandOutput = TcpRedirection;
