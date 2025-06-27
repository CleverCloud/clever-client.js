export interface GetProductAddonVersionsCommandInput {
  id: string;
}

export interface GetProductAddonVersionsCommandOutput {
  clusters: Array<ProductAddonClusterVersion>;
  dedicated: Record<string, ProductAddonDedicatedVersion>;
  defaultDedicatedVersion: string;
}

export interface ProductAddonVersions {
  clusters: Array<ProductAddonClusterVersion>;
  dedicated: Record<string, ProductAddonDedicatedVersion>;
  defaultDedicatedVersion: string;
}

export interface ProductAddonClusterVersion {
  id: string;
  label: string;
  zone: string;
  version: string;
  features: Array<{
    name: string;
    enabled: boolean;
  }>;
}

export interface ProductAddonDedicatedVersion {
  features: Array<{
    name: string;
    enabled: boolean;
  }>;
}
