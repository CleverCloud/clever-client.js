import type { Domain } from './domain.types.ts';

export function transformDomain(domain: any, isPrimary = false): Domain {
  return {
    domain: domain.fqdn,
    isPrimary,
  };
}
