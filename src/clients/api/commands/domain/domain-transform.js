/**
 * @import { Domain } from './domain.types.d.ts'
 */

/**
 * @param {any} domain
 * @param {boolean} [isPrimary]
 * @returns {Domain}
 */
export function transformDomain(domain, isPrimary = false) {
  return {
    domain: domain.fqdn,
    isPrimary,
  };
}
