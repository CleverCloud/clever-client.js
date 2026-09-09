import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LoadBalancer } from './load-balancer.types.js';

/**
 * Identifies the application or add-on whose load balancers are requested. The owner is resolved automatically when
 * omitted.
 */
export type GetLoadBalancerInfoCommandInput = ApplicationOrAddonId & {
  /**
   * Which load balancers to return: the public ones (`default`) or the ones reserved to a private setup (`private`).
   * Defaults to `default`.
   */
  kind?: 'default' | 'private';
};

/**
 * The load balancers serving the resource. Sorted by id.
 */
export type GetLoadBalancerInfoCommandOutput = Array<LoadBalancer>;
