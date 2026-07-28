import { describe, expect, it } from 'vitest';
import { asNetworkError } from '../../../../src/lib/error/network-error.js';
import type { CcRequest } from '../../../../src/types/request.types.js';
import { expectToBeDefined } from '../../../lib/expect-utils.js';

describe('asNetworkError', () => {
  const REQUEST = {} as CcRequest;

  /** A `fetch()` rejection as Node builds it: the same `TypeError` every time, wrapping the real error. */
  function nodeRejection(message: string, cause: unknown): TypeError {
    return new TypeError(message, { cause });
  }

  function platformError(code: string): Error {
    return Object.assign(new Error(`connect ${code} 10.0.0.1:443`), { code });
  }

  describe('the engines that name the failure', () => {
    it.for([
      ['a name that does not resolve', 'ENOTFOUND'],
      ['a resolver that is not answering', 'EAI_AGAIN'],
      ['a host with no route to it', 'EHOSTUNREACH'],
      ['a network that is down', 'ENETUNREACH'],
      ['a connection that was refused', 'ECONNREFUSED'],
      ['a connection that was reset', 'ECONNRESET'],
      ['a connection that never completed', 'UND_ERR_CONNECT_TIMEOUT'],
      ['a server that stopped sending headers', 'UND_ERR_HEADERS_TIMEOUT'],
      ['a socket that died mid-response', 'UND_ERR_SOCKET'],
    ] as const)('should report %s as its platform code', ([, code]) => {
      const error = asNetworkError(nodeRejection('fetch failed', platformError(code)), REQUEST);

      expectToBeDefined(error);
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.networkCode).toBe(code);
    });

    it('should read the code off the rejection itself when there is no cause', () => {
      const error = asNetworkError(platformError('ECONNRESET'), REQUEST);

      expectToBeDefined(error);
      expect(error.networkCode).toBe('ECONNRESET');
    });

    it('should read the code through a chain of causes', () => {
      const rejection = nodeRejection('terminated', nodeRejection('fetch failed', platformError('EPIPE')));

      expect(asNetworkError(rejection, REQUEST)?.networkCode).toBe('EPIPE');
    });

    it('should read the code off an AggregateError, as raised when every address of a host failed', () => {
      const addresses = new AggregateError(
        [platformError('ECONNREFUSED'), platformError('ECONNREFUSED')],
        'all addresses failed',
      );

      expect(asNetworkError(nodeRejection('fetch failed', addresses), REQUEST)?.networkCode).toBe('ECONNREFUSED');
    });

    it('should expose the platform error as the cause, not the wrapper that says nothing', () => {
      const platform = platformError('ECONNREFUSED');

      expect(asNetworkError(nodeRejection('fetch failed', platform), REQUEST)?.cause).toBe(platform);
    });
  });

  describe('the engines that do not name the failure', () => {
    it.for([
      ['Chromium', 'Failed to fetch'],
      ['WebKit', 'Load failed'],
      ['WebKit', 'The network connection was lost.'],
      ['WebKit', 'network error'],
      ['Gecko', 'NetworkError when attempting to fetch resource.'],
      ['Node, before the response', 'fetch failed'],
      ['Node, during the response', 'terminated'],
    ] as const)('should report the %s failure "%s" with no code', ([, message]) => {
      const error = asNetworkError(new TypeError(message), REQUEST);

      expectToBeDefined(error);
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.networkCode).toBeNull();
    });

    it('should report a code it does not know about with no code rather than not at all', () => {
      const tlsFailure = nodeRejection('fetch failed', platformError('CERT_HAS_EXPIRED'));
      const error = asNetworkError(tlsFailure, REQUEST);

      expectToBeDefined(error);
      expect(error.networkCode).toBeNull();
    });
  });

  describe('what is not a network failure', () => {
    it.for([
      ['a TypeError from the caller', new TypeError('Cannot read properties of undefined')],
      ['an error of another kind', new Error('Failed to fetch')],
      ['a rejection that is not an object', 'Failed to fetch'],
      ['a rejection that is null', null],
      ['a rejection that is undefined', undefined],
    ] as const)('should not name %s', ([, rejection]) => {
      expect(asNetworkError(rejection, REQUEST)).toBeNull();
    });
  });
});
