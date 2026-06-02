import type { Domain } from './domain.types.js';

export function transformDomain(domain: any, isPrimary = false): Domain {
  return {
    domain: domain.fqdn,
    isPrimary,
  };
}
