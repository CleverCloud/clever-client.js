export interface TcpRedirection {
  namespace: TcpRedirectionNamespace;
  port: number;
}

export type TcpRedirectionNamespace = 'default' | 'cleverapps' | string;
