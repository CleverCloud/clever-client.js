/**
 * @import { LoadBalancer } from './load-balancer.types.js'
 */

/**
 * @param {any} payload
 * {LoadBalancer}
 */
export function transformLoadBalancer(payload) {
  return {
    id: payload.id,
    zone: payload.name,
    zoneId: payload.zoneId,
    dns: {
      cname: payload.dns.cname,
      a: payload.dns.a,
    },
  };
}
