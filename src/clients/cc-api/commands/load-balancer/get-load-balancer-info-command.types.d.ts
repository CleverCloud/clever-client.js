import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LoadBalancer } from './load-balancer.types.js';

export type GetLoadBalancerInfoCommandInput = ApplicationOrAddonId & {
  kind?: 'default' | 'private';
};

export type GetLoadBalancerInfoCommandOutput = Array<LoadBalancer>;
