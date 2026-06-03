import type { DomainInfo } from './diag-domain-config.types.js';

/**
 * Extracts `hostname`, `pathname`, `isWildcard` from a given `domain`
 */
export function parseDomain(domain: string): { hostname: string; pathname: string; isWildcard: boolean } {
  const domainWithHttp = domain.match(/^https?:\/\//) != null ? domain : 'https://' + domain;
  // With firefox, 'https://*.toto.com' is considered invalid so we strip it off for the test
  // because we know this part is valid and we want the rest to be sanitized by the URL parser
  const isWildcard = domain.startsWith('*.');

  if (!isWildcard && domain.includes('*')) {
    throw new DomainParseError('invalid-wildcard', 'Invalid wildcard format. "*" may only be used as a subdomain');
  }

  try {
    const { hostname, pathname } = new URL(domainWithHttp.replace('*.', ''));

    return {
      hostname,
      pathname,
      isWildcard,
    };
  } catch (e) {
    if (domain.length === 0) {
      throw new DomainParseError('empty', 'Empty domain value');
    }

    throw new DomainParseError('invalid-format', 'Invalid domain format', e);
  }
}

export class DomainParseError extends Error {
  code: 'empty' | 'invalid-wildcard' | 'invalid-format';
  cause?: unknown;

  constructor(code: 'empty' | 'invalid-wildcard' | 'invalid-format', message: string, cause?: unknown) {
    super(message);

    this.code = code;
    this.cause = cause;
  }
}

/**
 * If isWildcard is `true`, returns `*.${hostname}`
 * else returns the `hostname` untouched
 */
export function getHostWithWildcard(hostname: string, isWildcard: boolean): string {
  return [isWildcard ? '*.' : '', hostname].join('');
}

export function getDomainUrl(hostname: string, pathPrefix: string, isWildcard: boolean, isHttpOnly: boolean): string {
  return [isHttpOnly ? 'http://' : 'https://', isWildcard ? 'www.' : '', hostname, pathPrefix].join('');
}

/**
 * Parses a `domainWithPath` and builds its browsable URL in one step.
 *
 * The scheme is derived from the domain: test subdomains (e.g. `sub.app.cleverapps.io`)
 * are HTTP only, everything else uses HTTPS.
 */
export function domainToUrl(domainWithPath: string): string {
  const { hostname, pathname, isWildcard } = parseDomain(domainWithPath);
  const isHttpOnly = isTestDomainWithSubdomain(hostname);
  return getDomainUrl(hostname, pathname, isWildcard, isHttpOnly);
}

export function isTestDomain(hostname: string): boolean {
  return hostname.endsWith('.cleverapps.io');
}

/**
 * Checks if the domain is a `cleverapps.io` domain and if it contains a subdomain.
 * For instance `subdomain.main.cleverapps.io` is HTTP only.
 *
 * @returns whether the domain is a `cleverapps.io` is HTTP only or not
 */
export function isTestDomainWithSubdomain(domain: string): boolean {
  return isTestDomain(domain) && domain.split('.').length > 3;
}

export function sortDomains(
  domainA: Pick<DomainInfo, 'isPrimary' | 'hostname' | 'isWildcard' | 'pathPrefix'>,
  domainB: Pick<DomainInfo, 'isPrimary' | 'hostname' | 'isWildcard' | 'pathPrefix'>,
): number {
  if (domainA.isPrimary) {
    return -1;
  }

  if (domainB.isPrimary) {
    return 1;
  }

  const reversedDomainA = reverseDomain(domainA);
  const reversedDomainB = reverseDomain(domainB);

  return reversedDomainA.localeCompare(reversedDomainB);
}

function reverseDomain(domain: Pick<DomainInfo, 'hostname' | 'isWildcard' | 'pathPrefix'>): string {
  return domain.hostname.split('.').reverse().join('.') + (domain.isWildcard ? '.*' : '') + domain.pathPrefix;
}
