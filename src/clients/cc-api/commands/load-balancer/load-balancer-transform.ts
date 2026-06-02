import type { LoadBalancer } from './load-balancer.types.js';

export function transformLoadBalancer(payload: any): LoadBalancer {
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
