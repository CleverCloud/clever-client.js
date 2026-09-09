import { describe, expect, it } from 'vitest';
import { CcClientError, CcHttpError, CcNetworkError, CcRequestError } from '../../../src/lib/error/cc-client-errors.js';
import type { CcRequest, CcResponse } from '../../../src/types/request.types.js';
import type { NetworkErrorCode } from '../../../src/utils/error-utils.js';
import {
  getNetworkErrorInfo,
  isCcClientError,
  isCcHttpError,
  isCcHttpErrorWithCode,
  isCcHttpErrorWithStatus,
  isCcRequestError,
  isRateLimitError,
  NETWORK_ERROR_CODES,
  NETWORK_ERRORS,
  NETWORK_RETRY_ADVICES,
  tolerateNotFound,
  tolerateStatus,
} from '../../../src/utils/error-utils.js';

const REQUEST = {} as CcRequest;

function response(status: number): CcResponse<unknown> {
  return { status, headers: new Headers(), body: undefined, requestDuration: 0, hasHitCache: false };
}

function httpError(status: number, code: string): CcHttpError {
  return new CcHttpError(`Error ${status}`, code, REQUEST, response(status));
}

describe('isCcClientError', () => {
  it('should match any client error', () => {
    expect(isCcClientError(new CcClientError('boom', 'some.code'))).toBe(true);
    expect(isCcClientError(new CcRequestError('boom', 'some.code', REQUEST))).toBe(true);
    expect(isCcClientError(httpError(404, 'some.code'))).toBe(true);
  });

  it('should not match a native error', () => {
    expect(isCcClientError(new Error('boom'))).toBe(false);
  });
});

describe('isCcRequestError', () => {
  it('should match request errors and http errors', () => {
    expect(isCcRequestError(new CcRequestError('boom', 'some.code', REQUEST))).toBe(true);
    expect(isCcRequestError(httpError(404, 'some.code'))).toBe(true);
  });

  it('should not match a plain client error', () => {
    expect(isCcRequestError(new CcClientError('boom', 'some.code'))).toBe(false);
  });
});

describe('isCcHttpError', () => {
  it('should match an http error', () => {
    expect(isCcHttpError(httpError(404, 'some.code'))).toBe(true);
  });

  it('should not match a request error', () => {
    expect(isCcHttpError(new CcRequestError('boom', 'some.code', REQUEST))).toBe(false);
  });
});

describe('isCcHttpErrorWithStatus', () => {
  it('should match when the status is the same', () => {
    expect(isCcHttpErrorWithStatus(httpError(404, 'some.code'), 404)).toBe(true);
  });

  it('should not match when the status differs', () => {
    expect(isCcHttpErrorWithStatus(httpError(500, 'some.code'), 404)).toBe(false);
  });

  it('should not match a non-http error carrying a statusCode', () => {
    expect(isCcHttpErrorWithStatus({ statusCode: 404 }, 404)).toBe(false);
  });

  it('should not match nullish values', () => {
    expect(isCcHttpErrorWithStatus(null, 404)).toBe(false);
    expect(isCcHttpErrorWithStatus(undefined, 404)).toBe(false);
  });
});

describe('isCcHttpErrorWithCode', () => {
  it('should match when the code is the same', () => {
    expect(isCcHttpErrorWithCode(httpError(404, 'clever.some.code'), 'clever.some.code')).toBe(true);
  });

  it('should not match when the code differs', () => {
    expect(isCcHttpErrorWithCode(httpError(404, 'clever.some.other-code'), 'clever.some.code')).toBe(false);
  });

  it('should not match a non-http error carrying a code', () => {
    expect(isCcHttpErrorWithCode({ code: 'clever.some.code' }, 'clever.some.code')).toBe(false);
  });

  it('should not match a request error carrying the same code', () => {
    expect(isCcHttpErrorWithCode(new CcRequestError('boom', 'clever.some.code', REQUEST), 'clever.some.code')).toBe(
      false,
    );
  });
});

describe('isRateLimitError', () => {
  it('should match the normalized rate limit code', () => {
    expect(isRateLimitError(httpError(429, 'clever.core.too-many-requests'))).toBe(true);
  });

  it('should match whatever status the backend used', () => {
    expect(isRateLimitError(httpError(403, 'clever.core.too-many-requests'))).toBe(true);
  });

  it('should not match another error', () => {
    expect(isRateLimitError(httpError(403, 'unknown_error'))).toBe(false);
  });
});

describe('tolerateStatus', () => {
  it('should resolve to the value when the promise fulfills', async () => {
    await expect(tolerateStatus(Promise.resolve('value'), 409)).resolves.toBe('value');
  });

  it('should resolve to `undefined` when the promise rejects with the given status', async () => {
    await expect(tolerateStatus(Promise.reject(httpError(409, 'some.code')), 409)).resolves.toBeUndefined();
  });

  it('should rethrow an http error with another status', async () => {
    const error = httpError(500, 'some.code');
    await expect(tolerateStatus(Promise.reject(error), 409)).rejects.toBe(error);
  });

  it('should rethrow a non-http error, even one carrying the given statusCode', async () => {
    const error = Object.assign(new Error('boom'), { statusCode: 409 });
    await expect(tolerateStatus(Promise.reject(error), 409)).rejects.toBe(error);
  });
});

describe('tolerateNotFound', () => {
  it('should resolve to the value when the promise fulfills', async () => {
    await expect(tolerateNotFound(Promise.resolve('value'))).resolves.toBe('value');
  });

  it('should resolve to `undefined` when the promise rejects with a 404', async () => {
    await expect(tolerateNotFound(Promise.reject(httpError(404, 'some.code')))).resolves.toBeUndefined();
  });

  it('should rethrow an http error with another status', async () => {
    const error = httpError(500, 'some.code');
    await expect(tolerateNotFound(Promise.reject(error))).rejects.toBe(error);
  });

  it('should rethrow a non-http error, even one carrying a 404 statusCode', async () => {
    const error = Object.assign(new Error('boom'), { statusCode: 404 });
    await expect(tolerateNotFound(Promise.reject(error))).rejects.toBe(error);
  });
});

describe('network retry advice', () => {
  function networkError(code: NetworkErrorCode | null, isIdempotent: boolean = true): CcNetworkError {
    return new CcNetworkError({ ...REQUEST, isIdempotent }, code);
  }

  describe('getNetworkErrorInfo', () => {
    it('should advise on every code with one of the stances it says it uses', () => {
      const advices = NETWORK_ERROR_CODES.map((code) => getNetworkErrorInfo(code).retryAdvice);

      expect(advices.filter((advice) => NETWORK_RETRY_ADVICES.includes(advice))).toHaveLength(
        NETWORK_ERROR_CODES.length,
      );
    });

    it.for([
      ['a resolver that will answer next time', 'EAI_AGAIN'],
      ['a server that has not started listening yet', 'ECONNREFUSED'],
      ['a network that is down and will come back', 'ENETDOWN'],
      ['a connection that never completed', 'UND_ERR_CONNECT_TIMEOUT'],
    ] as const)('should say to retry %s', ([, code]) => {
      expect(getNetworkErrorInfo(code).retryAdvice).toBe('retry');
    });

    it.for([
      ['a connection reset by the peer', 'ECONNRESET'],
      ['a socket written to after it was closed', 'EPIPE'],
      ['a response that stopped mid-body', 'ERR_STREAM_PREMATURE_CLOSE'],
      ['a keep-alive socket the server closed', 'UND_ERR_SOCKET'],
    ] as const)('should make retrying %s conditional, the server may have acted', ([, code]) => {
      expect(getNetworkErrorInfo(code).retryAdvice).toBe('retry-if-idempotent');
    });

    it.for([
      ['a domain that does not exist', 'ENOTFOUND'],
      ['a URL with no usable host', 'EAI_NONAME'],
      ['a local firewall refusing to let us out', 'ECONNABORTED'],
      ['a server that answers nothing at all', 'UND_ERR_HEADERS_TIMEOUT'],
      ['a certificate signed by an authority this machine does not trust', 'SELF_SIGNED_CERT_IN_CHAIN'],
    ] as const)('should say not to retry %s', ([, code]) => {
      expect(getNetworkErrorInfo(code).retryAdvice).toBe('do-not-retry');
    });

    it('should stay careful when the platform named no code, as browsers do', () => {
      expect(getNetworkErrorInfo(null).retryAdvice).toBe('retry-if-idempotent');
    });
  });

  describe('CcNetworkError.isWorthRetrying', () => {
    it('should retry whatever the command when the request never reached the server', () => {
      expect(networkError('ECONNREFUSED', false).isWorthRetrying()).toBe(true);
      expect(networkError('ECONNREFUSED', true).isWorthRetrying()).toBe(true);
    });

    it('should refuse whatever the command when nothing will change by itself', () => {
      expect(networkError('ENOTFOUND', true).isWorthRetrying()).toBe(false);
      expect(networkError('ENOTFOUND', false).isWorthRetrying()).toBe(false);
    });

    it('should replay a request the command declared replayable when it died on an established connection', () => {
      expect(networkError('ECONNRESET', true).isWorthRetrying()).toBe(true);
    });

    it('should not replay a request that may already have been processed and means it twice', () => {
      expect(networkError('ECONNRESET', false).isWorthRetrying()).toBe(false);
    });

    it('should not read the method, a GET nobody declared replayable being held back like any other', () => {
      const getRequest = { ...REQUEST, method: 'GET', isIdempotent: false } as CcRequest;

      expect(new CcNetworkError(getRequest, 'ECONNRESET').isWorthRetrying()).toBe(false);
    });

    it('should hold a non-replayable request back when the browser refused to say what happened', () => {
      expect(networkError(null, false).isWorthRetrying()).toBe(false);
      expect(networkError(null, true).isWorthRetrying()).toBe(true);
    });

    it('should leave the reason readable, so a held-back request can be told from a hopeless one', () => {
      expect(networkError('ECONNRESET', false).retryAdvice).toBe('retry-if-idempotent');
      expect(networkError('ENOTFOUND', false).retryAdvice).toBe('do-not-retry');
    });
  });
});

describe('network error explanations', () => {
  it('should list exactly the codes the table defines, so the two cannot drift', () => {
    expect([...NETWORK_ERROR_CODES].sort()).toEqual(Object.keys(NETWORK_ERRORS).sort());
  });

  it('should read as prose rather than as a label, so it can be shown as is', () => {
    for (const code of NETWORK_ERROR_CODES) {
      const { explanation } = getNetworkErrorInfo(code);

      expect(explanation, `${code} should be a sentence`).toMatch(/^[A-Z].*\.$/s);
      expect(explanation.length, `${code} should say something`).toBeGreaterThan(60);
    }
  });

  it('should explain a failure the platform did not name, rather than guess one', () => {
    const explanation = new CcNetworkError(REQUEST, null).explanation;

    expect(explanation).toContain('did not say why');
    expect(explanation).toContain('CORS');
  });

  it('should explain a failure the platform named', () => {
    expect(new CcNetworkError(REQUEST, 'ECONNREFUSED').explanation).toBe(NETWORK_ERRORS.ECONNREFUSED.explanation);
  });
});
