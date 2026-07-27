import type { LoadBalancer } from './load-balancer.types.js';

export function transformLoadBalancer(payload: any): LoadBalancer {
  return {
    id: payload.id,
    name: payload.name,
    zone: payload.zoneId,
    dns: {
      cname: payload.dns.cname,
      aRecords: payload.dns.a,
    },
  };
}
