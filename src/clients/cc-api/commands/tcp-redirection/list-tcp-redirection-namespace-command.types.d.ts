import type { TcpRedirectionNamespace } from './tcp-redirection.types.js';

export interface ListTcpRedirectionNamespaceCommandInput {
  ownerId: string;
}

export type ListTcpRedirectionNamespaceCommandOutput = Array<{ namespace: TcpRedirectionNamespace }>;
