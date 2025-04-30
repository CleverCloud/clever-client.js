/**
 * @import { Domain } from './domain.types.js'
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
