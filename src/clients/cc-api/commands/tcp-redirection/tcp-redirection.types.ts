export interface TcpRedirection {
  namespace: TcpRedirectionNamespace;
  port: number;
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- the literals document the well-known namespaces while still allowing any string
export type TcpRedirectionNamespace = 'default' | 'cleverapps' | string;
