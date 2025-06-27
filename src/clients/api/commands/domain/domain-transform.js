/**
 * @import { Domain } from './domain.types.d.ts'
 */

/**
 * @param {any} domain
 * @returns {Domain}
 */
export function transformDomain(domain) {
  return {
    domain: domain.fqdn,
  };
}
