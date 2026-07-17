import { describe, expect, it } from 'vitest';
import {
  DomainParseError,
  domainToUrl,
  getDomainUrl,
  getHostWithWildcard,
  isTestDomain,
  isTestDomainWithSubdomain,
  parseDomain,
  sortDomains,
} from '../../../src/utils/domain-utils.js';

describe('domain-utils', () => {
  describe('parseDomain()', () => {
    it('should parse a simple http URL', () => {
      const parsedDomain = parseDomain('http://example.com');
      const expected = {
        hostname: 'example.com',
        pathPrefix: '/',
        isWildcard: false,
      };
      expect(parsedDomain).toEqual(expected);
    });

    it('should parse a simple https URL', () => {
      const parsedDomain = parseDomain('https://example.com');
      const expected = {
        hostname: 'example.com',
        pathPrefix: '/',
        isWildcard: false,
      };
      expect(parsedDomain).toEqual(expected);
    });

    it('should parse a simple domain', () => {
      const parsedDomain = parseDomain('example.com');
      const expected = {
        hostname: 'example.com',
        pathPrefix: '/',
        isWildcard: false,
      };
      expect(parsedDomain).toEqual(expected);
    });

    it('should parse a domain with subdomain', () => {
      const parsedDomain = parseDomain('sub.example.com');
      const expected = {
        hostname: 'sub.example.com',
        pathPrefix: '/',
        isWildcard: false,
      };
      expect(parsedDomain).toEqual(expected);
    });

    it('should parse a wildcard domain', () => {
      const parsedDomain = parseDomain('*.example.com');
      const expected = {
        hostname: 'example.com',
        pathPrefix: '/',
        isWildcard: true,
      };
      expect(parsedDomain).toEqual(expected);
    });

    it('should parse a domain with path', () => {
      const parsedDomain = parseDomain('example.com/path');
      const expected = {
        hostname: 'example.com',
        pathPrefix: '/path',
        isWildcard: false,
      };
      expect(parsedDomain).toEqual(expected);
    });

    it('should throw DomainParseError for invalid wildcard', () => {
      const parseDomainCallback = () => parseDomain('example*.com');
      expect(parseDomainCallback).toThrow(DomainParseError);
      expect(parseDomainCallback).toThrow(expect.objectContaining({ code: 'invalid-wildcard' }));
    });

    it('should throw DomainParseError for empty domain', () => {
      const parseDomainCallback = () => parseDomain('');
      expect(parseDomainCallback).toThrow(DomainParseError);
      expect(parseDomainCallback).toThrow(expect.objectContaining({ code: 'empty' }));
    });

    it('should throw DomainParseError for invalid format', () => {
      const parseDomainCallback = () => parseDomain('].com');
      expect(parseDomainCallback).toThrow(DomainParseError);
      expect(parseDomainCallback).toThrow(expect.objectContaining({ code: 'invalid-format' }));
    });

    it('should carry the original error as cause for invalid format', () => {
      let thrown: DomainParseError | undefined;
      try {
        parseDomain('].com');
      } catch (e) {
        thrown = e as DomainParseError;
      }
      expect(thrown).toBeInstanceOf(DomainParseError);
      expect(thrown?.cause).toBeInstanceOf(Error);
    });

    it('should not set a cause for empty domain', () => {
      let thrown: DomainParseError | undefined;
      try {
        parseDomain('');
      } catch (e) {
        thrown = e as DomainParseError;
      }
      expect(thrown).toBeInstanceOf(DomainParseError);
      expect(thrown?.cause).toBeUndefined();
    });
  });

  describe('getHostWithWildcard()', () => {
    it('should return hostname with wildcard prefix when isWildcard is true', () => {
      const wildcardHostname = getHostWithWildcard('example.com', true);
      expect(wildcardHostname).toBe('*.example.com');
    });

    it('should return hostname without changes when isWildcard is false', () => {
      const nonWildcardHostname = getHostWithWildcard('example.com', false);
      expect(nonWildcardHostname).toBe('example.com');
    });
  });

  describe('getDomainUrl()', () => {
    it('should return HTTPS URL for non-wildcard, non-HTTP only domain', () => {
      const httpsUrl = getDomainUrl('example.com', '/path', false, false);
      expect(httpsUrl).toBe('https://example.com/path');
    });

    it('should return HTTP URL for HTTP only domain', () => {
      const httpUrl = getDomainUrl('example.com', '/path', false, true);
      expect(httpUrl).toBe('http://example.com/path');
    });

    it('should include www for wildcard domains', () => {
      const wildcardUrl = getDomainUrl('example.com', '/path', true, false);
      expect(wildcardUrl).toBe('https://www.example.com/path');
    });

    it('should include www and use HTTP for wildcard HTTP only domains', () => {
      const wildcardHttpUrl = getDomainUrl('example.com', '/path', true, true);
      expect(wildcardHttpUrl).toBe('http://www.example.com/path');
    });
  });

  describe('domainToUrl()', () => {
    it('should build an HTTPS URL from a simple domain with path', () => {
      const url = domainToUrl('example.com/path');
      expect(url).toBe('https://example.com/path');
    });

    it('should build a www HTTPS URL from a wildcard domain', () => {
      const url = domainToUrl('*.example.com');
      expect(url).toBe('https://www.example.com/');
    });

    it('should derive an HTTP URL for a test subdomain', () => {
      const url = domainToUrl('sub.app.cleverapps.io');
      expect(url).toBe('http://sub.app.cleverapps.io/');
    });

    it('should derive an HTTPS URL for a test domain without a subdomain', () => {
      const url = domainToUrl('app.cleverapps.io');
      expect(url).toBe('https://app.cleverapps.io/');
    });

    it('should throw DomainParseError for an invalid domain', () => {
      const domainToUrlCallback = () => domainToUrl('');
      expect(domainToUrlCallback).toThrow(DomainParseError);
      expect(domainToUrlCallback).toThrow(expect.objectContaining({ code: 'empty' }));
    });
  });

  describe('isTestDomain()', () => {
    it('should return true for cleverapps.io domain', () => {
      const isTestDomainResult = isTestDomain('app.cleverapps.io');
      expect(isTestDomainResult).toBe(true);
    });

    it('should return false for non-cleverapps.io domain', () => {
      const isTestDomainResult = isTestDomain('example.com');
      expect(isTestDomainResult).toBe(false);
    });

    it('should return false for domain ending with cleverapps.io without a label boundary', () => {
      const isTestDomainResult = isTestDomain('mycleverapps.io');
      expect(isTestDomainResult).toBe(false);
    });
  });

  describe('isTestDomainWithSubdomain()', () => {
    it('should return true for cleverapps.io domain with subdomain', () => {
      const isTestWithSubdomain = isTestDomainWithSubdomain('sub.app.cleverapps.io');
      expect(isTestWithSubdomain).toBe(true);
    });

    it('should return false for cleverapps.io domain without subdomain', () => {
      const isTestWithSubdomain = isTestDomainWithSubdomain('app.cleverapps.io');
      expect(isTestWithSubdomain).toBe(false);
    });

    it('should return false for non-cleverapps.io domain', () => {
      const isTestWithSubdomain = isTestDomainWithSubdomain('sub.example.com');
      expect(isTestWithSubdomain).toBe(false);
    });
  });

  describe('sortDomains()', () => {
    it('should sort domains alphabetically with primary first', () => {
      const domains = [
        { hostname: 'example.com', isPrimary: false, isWildcard: false, pathPrefix: '/' },
        { hostname: 'primary.com', isPrimary: true, isWildcard: false, pathPrefix: '/' },
        { hostname: 'sub.example.com', isPrimary: false, isWildcard: false, pathPrefix: '/' },
        { hostname: 'wildcard.com', isPrimary: false, isWildcard: true, pathPrefix: '/' },
      ];

      const sorted = [...domains].sort(sortDomains);
      expect(sorted).toEqual([
        { hostname: 'primary.com', isPrimary: true, isWildcard: false, pathPrefix: '/' },
        { hostname: 'sub.example.com', isPrimary: false, isWildcard: false, pathPrefix: '/' },
        { hostname: 'example.com', isPrimary: false, isWildcard: false, pathPrefix: '/' },
        { hostname: 'wildcard.com', isPrimary: false, isWildcard: true, pathPrefix: '/' },
      ]);
    });

    it('should keep the primary domain first regardless of its position', () => {
      const primary = { hostname: 'z-example.com', isPrimary: true, isWildcard: false, pathPrefix: '/' };
      const other = { hostname: 'a-example.com', isPrimary: false, isWildcard: false, pathPrefix: '/' };

      expect(sortDomains(primary, other)).toBe(-1);
      expect(sortDomains(other, primary)).toBe(1);
    });

    it('should use pathPrefix as a tie-breaker for the same hostname', () => {
      const domainA = { hostname: 'example.com', isPrimary: false, isWildcard: false, pathPrefix: '/a' };
      const domainB = { hostname: 'example.com', isPrimary: false, isWildcard: false, pathPrefix: '/b' };

      const sorted = [domainB, domainA].sort(sortDomains);
      expect(sorted).toEqual([domainA, domainB]);
    });

    it('should treat the wildcard flag as part of the sort key for the same hostname', () => {
      const wildcard = { hostname: 'example.com', isPrimary: false, isWildcard: true, pathPrefix: '/' };
      const nonWildcard = { hostname: 'example.com', isPrimary: false, isWildcard: false, pathPrefix: '/' };

      const sorted = [nonWildcard, wildcard].sort(sortDomains);
      expect(sorted).toEqual([wildcard, nonWildcard]);
    });
  });
});
