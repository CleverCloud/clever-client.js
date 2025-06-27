import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';

export type GetLoadBalancerInfoCommandInput = ApplicationOrAddonId & {
  kind?: 'DEFAULT' | 'PRIVATE';
};

export type GetLoadBalancerInfoCommandOutput = Array<LoadBalancer>;

export interface LoadBalancer {
  id: string;
  name: string;
  zoneId: string;
  dns: {
    cname: string;
    a: Array<string>;
  };
}
