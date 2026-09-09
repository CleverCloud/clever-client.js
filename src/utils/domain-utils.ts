export interface Domain {
  /** The domain hostname (e.g. `www.example.com`). For a wildcard domain, the `*.` prefix is stripped (see `isWildcard`). */
  hostname: string;
  /** The path prefix the domain is routed on (e.g. `/api`), or `/` when routed at the root. */
  pathPrefix: string;
  /** Whether the domain is a wildcard (e.g. `*.example.com`). */
  isWildcard: boolean;
}

/** A domain as attached to an application, carrying its role in the app's domain list. */
export interface ApplicationDomain extends Domain {
  /** Whether this is the application's primary domain. */
  isPrimary: boolean;
}

/**
 * Extracts `hostname`, `pathPrefix`, `isWildcard` from a given `domain`
 */
export function parseDomain(domain: string): Domain {
  const domainWithHttp = domain.match(/^https?:\/\//) != null ? domain : 'https://' + domain;
  // With firefox, 'https://*.toto.com' is considered invalid so we strip it off for the test
  // because we know this part is valid and we want the rest to be sanitized by the URL parser
  const isWildcard = domain.startsWith('*.');

  if (!isWildcard && domain.includes('*')) {
    throw new DomainParseError('invalid-wildcard', 'Invalid wildcard format. "*" may only be used as a subdomain');
  }

  try {
    const { hostname, pathname: pathPrefix } = new URL(domainWithHttp.replace('*.', ''));

    return {
      hostname,
      pathPrefix,
      isWildcard,
    };
  } catch (e) {
    if (domain.length === 0) {
      throw new DomainParseError('empty', 'Empty domain value');
    }

    throw new DomainParseError('invalid-format', 'Invalid domain format', e);
  }
}

/**
 * Guesses which domain should be the primary one among a list of domains, used as a
 * fallback when an application has no favourite domain set.
 *
 * Domains are preferred in the following order:
 * - the first non-test (see {@link isTestDomain}), non-wildcard domain
 * - the first non-test domain
 * - the first non-wildcard domain
 * - the first domain
 *
 * @returns the guessed primary domain, or `undefined` when the list is empty
 */
export function guessPrimaryDomain(domains: Array<string>): string | undefined {
  const parsed = domains.map((domain) => ({ domain, ...parseDomain(domain) }));

  const guess =
    parsed.find(({ hostname, isWildcard }) => !isTestDomain(hostname) && !isWildcard) ??
    parsed.find(({ hostname }) => !isTestDomain(hostname)) ??
    parsed.find(({ isWildcard }) => !isWildcard) ??
    parsed.at(0);

  return guess?.domain;
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

/**
 * Builds the browsable URL for a domain, prefixing a wildcard hostname with `www.`
 * (since `*.example.com` itself isn't a valid browsable URL) and choosing the scheme
 * based on `isHttpOnly`.
 */
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
  const { hostname, pathPrefix, isWildcard } = parseDomain(domainWithPath);
  const isHttpOnly = isTestDomainWithSubdomain(hostname);
  return getDomainUrl(hostname, pathPrefix, isWildcard, isHttpOnly);
}

/**
 * Checks if the domain is a Clever Cloud test domain (`*.cleverapps.io`)
 */
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

/**
 * Comparator for sorting domains: the primary domain always comes first, the rest are
 * ordered alphabetically by their reversed hostname (e.g. `com.example.www`), so that
 * domains sharing a common suffix end up next to each other.
 */
export function sortDomains(domainA: ApplicationDomain, domainB: ApplicationDomain): number {
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

function reverseDomain(domain: Domain): string {
  return domain.hostname.split('.').reverse().join('.') + (domain.isWildcard ? '.*' : '') + domain.pathPrefix;
}
