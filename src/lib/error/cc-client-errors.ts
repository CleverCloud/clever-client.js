import type { CcRequest, CcResponse } from '../../types/request.types.js';

//--

/**
 * Every code a {@link CcRequestError} can be raised with, that is every way a request can fail
 * before it reaches a response.
 *
 * They are all raised by the request pipeline, but the vocabulary lives here so that consumers can
 * branch on it — through `isCcRequestErrorWithCode` in `utils/error-utils.js` — without importing
 * the pipeline itself.
 */
export const CC_REQUEST_ERROR_CODES = ['ABORTED', 'NETWORK_ERROR', 'UNEXPECTED_ERROR', 'INVALID_URL'] as const;

export type CcRequestErrorCode = (typeof CC_REQUEST_ERROR_CODES)[number];

/**
 * What the client can say about retrying a request that failed with a given {@link NetworkErrorCode},
 * before knowing what the request was.
 *
 * Retrying asks two questions, and a client that answers only the first is how a retry loop ends up
 * charging the same card twice: *will it work this time*, and *can this request be sent again at all*. A
 * failure that happened before the server saw anything is safe to replay whatever the request does; one
 * that happened on an established connection may be replaying something already done.
 *
 * - `retry` — the request never reached the server and the cause is the kind that clears on its own,
 *   so replaying it is both safe and worth doing, whatever the request does.
 * - `retry-if-idempotent` — worth doing, but the server may have processed the request before the
 *   connection died. Fine for a `GET`, a `PUT` or a `DELETE`; a `POST` that creates a resource has to be
 *   either left alone or replayed under an idempotency key.
 * - `do-not-retry` — the same request will fail the same way until something is changed: a URL, a DNS
 *   record, a firewall rule, a server that is hung. Retrying only delays the error.
 *
 * This is the reasoning, not the answer: {@link CcNetworkError.isWorthRetrying} settles
 * `retry-if-idempotent` against the method of the request that actually failed, which the error knows
 * and the caller should not have to.
 */
export const NETWORK_RETRY_ADVICES = ['retry', 'retry-if-idempotent', 'do-not-retry'] as const;

export type NetworkRetryAdvice = (typeof NETWORK_RETRY_ADVICES)[number];

/**
 * Everything the client knows about one kind of network failure.
 *
 * @property explanation - What happened, in a sentence meant to be shown rather than parsed
 * @property retryAdvice - Whether the request is worth sending again, see {@link NETWORK_RETRY_ADVICES}
 */
export interface NetworkErrorInfo {
  explanation: string;
  retryAdvice: NetworkRetryAdvice;
}

/**
 * Every network failure the client recognises, and what it knows about each.
 *
 * This table is the source: {@link NETWORK_ERROR_CODES} is its keys and {@link NetworkErrorCode} their
 * type, so a failure cannot be listed without an explanation and a retry stance, and none of the three
 * can drift from the others.
 *
 * It refines a {@link CcNetworkError} rather than deciding it: the client detects the failure on the
 * shape of the `fetch()` rejection, then looks the code up here to say *which* one it was. So a
 * `CcNetworkError` does not always match an entry — browsers name no code at all, they raise an opaque
 * `TypeError` instead, and a runtime naming a code that is missing here is still recognised, just with a
 * `null` {@link CcNetworkError.networkCode}. Which is why entries can be added without the client having
 * missed failures in the meantime, and why they are grouped by what went wrong rather than kept to what
 * one runtime happens to raise.
 *
 * The explanations ship as data rather than as comments because a CLI printing why it cannot reach the
 * API, a log line someone reads at 3am and an error panel in a web console all need the sentence and not
 * the symbol. They describe causes rather than give instructions, since the client cannot know whose
 * machine it is running on.
 */
export const NETWORK_ERRORS = {
  //-- the name could not be resolved: nothing was dialled, so the address is what needs fixing

  EAI_AGAIN: {
    explanation:
      'The DNS resolver did not answer in time. This is the temporary kind of resolution failure: a machine whose network is not up yet, a container started before its DNS, a VPN that has just connected.',
    retryAdvice: 'retry',
  },
  EAI_FAIL: {
    explanation:
      'The DNS resolver answered, and the answer was a permanent failure: the zone is broken, or the server refused to serve it. Unlike EAI_AGAIN this does not clear by itself, the domain name system is what has to be fixed.',
    retryAdvice: 'do-not-retry',
  },
  EAI_NONAME: {
    explanation:
      'The host is not a name that can be resolved at all, rather than a name that resolved to nothing. In practice the URL was built with an empty or malformed host: a missing base URL, an unsubstituted placeholder.',
    retryAdvice: 'do-not-retry',
  },
  ENOTFOUND: {
    explanation:
      'The domain name resolved to nothing: it does not exist, or it has no address record. Look for a typo in the domain first, then for whatever was supposed to define it, such as a hosts file entry pointing at a local backend or a private zone only visible over a VPN.',
    retryAdvice: 'do-not-retry',
  },

  //-- there was no route to the host: the address is fine, getting there is not. Nothing was sent, and
  //-- these clear on their own when the network comes back, so they are worth waiting out.

  EHOSTDOWN: {
    explanation: 'The host was reached and it is down. Nothing can be done from here but wait for it to come back.',
    retryAdvice: 'retry',
  },
  EHOSTUNREACH: {
    explanation:
      'A router along the way could not forward any further. Usually the address is only reachable from inside a private network and the VPN is down, or the host has no route back.',
    retryAdvice: 'retry',
  },
  ENETDOWN: {
    explanation:
      'The local network interface is down: this machine has no network at all, not this host in particular. Nothing sent from here will reach anything until it is back.',
    retryAdvice: 'retry',
  },
  ENETUNREACH: {
    explanation:
      'There is no route to that network. Most often an IPv6 address on a machine with no IPv6 connectivity, so the name resolved to something unreachable from here, or a missing default route.',
    retryAdvice: 'retry',
  },

  //-- the connection was refused, lost, or never completed. Whether it had been established is what
  //-- decides the stance: before it, nothing was seen; after it, the server may already have acted.

  EADDRNOTAVAIL: {
    explanation:
      'The local address the connection tried to use is not available. This one is about the machine making the request rather than the one receiving it: a misconfigured network interface, or a port range exhausted by too many connections left open.',
    retryAdvice: 'do-not-retry',
  },
  ECONNABORTED: {
    explanation:
      'The connection was aborted locally before it was established, generally by the operating system or a local firewall. Worth looking at what on this machine filters outgoing connections.',
    retryAdvice: 'do-not-retry',
  },
  ECONNREFUSED: {
    explanation:
      'The host was reached and actively refused the connection: nothing is listening on that port. The server is not started, or not on the port it was expected on, which is what to suspect when a local backend has not finished booting.',
    retryAdvice: 'retry',
  },
  ECONNRESET: {
    explanation:
      'The other end killed a connection that was already established. The server crashed or restarted mid-request, or something in between, a proxy or a load balancer, dropped it.',
    retryAdvice: 'retry-if-idempotent',
  },
  ENETRESET: {
    explanation:
      'The connection was lost because the network changed underneath it: a machine switching Wi-Fi, a VPN reconnecting, a suspended laptop waking up.',
    retryAdvice: 'retry-if-idempotent',
  },
  EPIPE: {
    explanation:
      'The connection was closed by the other end while the request was still being sent. Same causes as ECONNRESET, seen earlier in the exchange, which means the request most likely never got through.',
    // most likely, not certainly, which is why it is not treated as safe to replay outright
    retryAdvice: 'retry-if-idempotent',
  },
  ETIMEDOUT: {
    explanation:
      'The connection attempt timed out at the operating system level: no answer at all, not even a refusal. Typically a firewall dropping packets silently instead of rejecting them, or a host that is simply not there. This is not the timeout configured on the request, which fails with TIMEOUT_EXCEEDED instead.',
    retryAdvice: 'retry',
  },

  //-- the connection was established and the TLS handshake failed on certificate verification: the
  //-- host is reachable, its identity is what could not be trusted. Nothing was sent, and nothing
  //-- changes until a certificate, a proxy or a trust store does, so none of these is worth retrying.

  DEPTH_ZERO_SELF_SIGNED_CERT: {
    explanation:
      'The server presented a self-signed certificate: it vouches for its own identity and nothing else vouches for it. Usually a local backend, a preview environment or an appliance serving the certificate it generated when it was installed.',
    retryAdvice: 'do-not-retry',
  },
  SELF_SIGNED_CERT_IN_CHAIN: {
    explanation:
      'The certificate chain leads up to a self-signed authority this machine does not trust. Almost always something inspecting TLS in the middle — a corporate proxy, an antivirus, a debugging tool — reissuing certificates under its own root, which has to be trusted by the runtime for the chain to verify.',
    retryAdvice: 'do-not-retry',
  },
  UNABLE_TO_GET_ISSUER_CERT_LOCALLY: {
    explanation:
      'The certificate names an issuer that is nowhere in the trust store being used. The chain is not broken, this machine simply has no reason to believe it: a private certificate authority, or a runtime reading a bundle of its own rather than the one the rest of the system uses.',
    retryAdvice: 'do-not-retry',
  },
  UNABLE_TO_VERIFY_LEAF_SIGNATURE: {
    explanation:
      'The chain stopped one certificate short of a trusted root. Typically a server sending only its own certificate and omitting the intermediate that links it to a root — a misconfiguration browsers tend to hide, because they keep intermediates seen on earlier connections, and other clients do not.',
    retryAdvice: 'do-not-retry',
  },

  //-- Node (undici) ran out of patience, or the socket died under it

  ERR_STREAM_PREMATURE_CLOSE: {
    explanation:
      'The response ended before it was complete. Whatever was received is a partial body and cannot be used.',
    retryAdvice: 'retry-if-idempotent',
  },
  UND_ERR_BODY_TIMEOUT: {
    explanation:
      'The server started answering, then stopped sending for longer than allowed (5 minutes by default). The request was processed. A response that is legitimately slow to stream needs a longer body timeout rather than another attempt.',
    retryAdvice: 'retry-if-idempotent',
  },
  UND_ERR_CONNECT_TIMEOUT: {
    explanation:
      'The connection could not be established within the allowed time (10 seconds by default). The packets went nowhere: a firewall dropping them, or a host too loaded to accept the connection.',
    retryAdvice: 'retry',
  },
  UND_ERR_HEADERS_TIMEOUT: {
    explanation:
      'The connection opened, but the server sent no response in time (5 minutes by default). It received the request and never answered, so it is either hung or doing work that takes longer than it is given.',
    // the server is hung rather than unreachable, so another attempt hangs the same way
    retryAdvice: 'do-not-retry',
  },
  UND_ERR_SOCKET: {
    explanation:
      'The connection died mid-exchange. Almost always a kept-alive connection that the server or an intermediary closed while it was being reused, which is a normal thing for them to do.',
    retryAdvice: 'retry-if-idempotent',
  },
} as const satisfies Record<string, NetworkErrorInfo>;

export type NetworkErrorCode = keyof typeof NETWORK_ERRORS;

/**
 * Every platform code the client recognises as a network failure, which is to say the keys of
 * {@link NETWORK_ERRORS} — there to be enumerated or validated against, when the rest of what is known
 * about each is not needed.
 */
export const NETWORK_ERROR_CODES = Object.keys(NETWORK_ERRORS) as ReadonlyArray<NetworkErrorCode>;

/**
 * What is known about a failure the platform named no code for, which is what browsers do: they raise an
 * opaque `TypeError` for every one of them, and the specification is what makes them indistinguishable.
 *
 * So the explanation says that rather than guessing a cause, and the stance is the careful one — enough
 * to retry a `GET` through a connection blip, not enough to replay a `POST` that may have gone through.
 */
const UNNAMED_NETWORK_ERROR: NetworkErrorInfo = {
  explanation:
    'The request did not reach the server, and the browser did not say why. It can be a server that is unreachable or down, a connection that dropped, or a request the browser itself refused to send: blocked by a CORS rule, by an extension, or by the page security policy.',
  retryAdvice: 'retry-if-idempotent',
};

/**
 * What the client knows about the failure the given code names.
 *
 * Prefer {@link CcNetworkError.explanation} and {@link CcNetworkError.isWorthRetrying}, which answer the
 * two questions this exists for about an error already in hand — and the second one better, since the
 * error knows the method of the request too. This is for the callers holding a bare code, one read back
 * from a log line or stored away from the request it came with.
 *
 * @param code - The code to look up, `null` when the platform named none
 */
export function getNetworkErrorInfo(code: NetworkErrorCode | null): NetworkErrorInfo {
  return code == null ? UNNAMED_NETWORK_ERROR : NETWORK_ERRORS[code];
}

/**
 * Whether the given value is one of the platform codes listed in {@link NETWORK_ERROR_CODES}.
 *
 * @param value - The value to test
 */
export function isNetworkErrorCode(value: unknown): value is NetworkErrorCode {
  return typeof value === 'string' && Object.hasOwn(NETWORK_ERRORS, value);
}

/**
 * Base error class for Clever Cloud client errors.
 * Extends the native Error class with an error code system.
 */
export class CcClientError extends Error {
  #code: string;

  /**
   * Creates a new client error.
   *
   * @param message - Human-readable error description
   * @param code - Machine-readable error code for programmatic handling
   * @param cause - Optional underlying cause of the error
   */
  constructor(message: string, code: string, cause?: unknown) {
    super(message, { cause });
    this.#code = code;
  }

  /**
   * Gets the error code associated with this error.
   *
   * @returns The machine-readable error code
   */
  get code(): string {
    return this.#code;
  }
}

/**
 * Error class for request-specific errors in the Clever Cloud client.
 * Extends CcClientError with request context information.
 */
export class CcRequestError extends CcClientError {
  #request: CcRequest;

  /**
   * Creates a new request error.
   *
   * @param message - Human-readable error description
   * @param code - Machine-readable error code
   * @param request - The request that caused the error
   * @param cause - Optional underlying cause of the error
   */
  constructor(message: string, code: string, request: CcRequest, cause?: unknown) {
    super(message, code, cause);
    this.#request = request;
  }

  /**
   * Gets the request object associated with this error.
   *
   * @returns The request that caused the error
   */
  get request(): CcRequest {
    return this.#request;
  }
}

/**
 * Error class for the requests that failed before they reached a response: a DNS resolution failure,
 * a refused or reset connection, a broken pipe, a connection timeout.
 *
 * Always carries the `NETWORK_ERROR` code. The platform names the failure on the raw `fetch()`
 * rejection, which the client decodes once, when raising this error, and exposes as
 * {@link networkCode} — so consumers never have to walk the `cause` chain to tell one failure from
 * another.
 */
export class CcNetworkError extends CcRequestError {
  #networkCode: NetworkErrorCode | null;

  /**
   * Creates a new network error.
   *
   * @param request - The request that failed
   * @param networkCode - The platform code behind the failure, `null` when it named none
   * @param cause - The underlying failure
   */
  constructor(request: CcRequest, networkCode: NetworkErrorCode | null, cause?: unknown) {
    super('A network error occurred while fetching HTTP endpoint', 'NETWORK_ERROR', request, cause);
    this.#networkCode = networkCode;
  }

  /**
   * Gets the platform code behind the failure.
   *
   * @returns One of {@link NETWORK_ERROR_CODES}, or `null` when the platform named no code — which
   * is what browsers do, they raise an opaque `TypeError` instead
   */
  get networkCode(): NetworkErrorCode | null {
    return this.#networkCode;
  }

  /**
   * Gets what happened, in a sentence meant to be shown rather than parsed.
   *
   * The {@link message} of this error says a network failure occurred, which is all it can say for every
   * instance of it. This says which one, why it usually happens and where to look — see
   * {@link NETWORK_ERRORS}. When the platform named no code, it says that much too, rather than picking
   * a likely cause.
   *
   * @returns A sentence describing the failure, never empty
   */
  get explanation(): string {
    return getNetworkErrorInfo(this.#networkCode).explanation;
  }

  /**
   * Gets the stance the failure alone justifies, before the request it happened to is taken into
   * account.
   *
   * {@link isWorthRetrying} is the one to call. Read this only to tell its two ways of saying no apart:
   * `do-not-retry` is hopeless, while `retry-if-idempotent` on a request that is not means it would be
   * worth replaying if it could be made safe — under an idempotency key, or after checking whether it
   * went through.
   *
   * @returns One of {@link NETWORK_RETRY_ADVICES}, see it for what each one licenses
   */
  get retryAdvice(): NetworkRetryAdvice {
    return getNetworkErrorInfo(this.#networkCode).retryAdvice;
  }

  /**
   * Whether sending this exact request again is worth it, and safe.
   *
   * The client is the one able to answer this: it knows which failure happened, whether the connection
   * had been established when it did — so whether the server may already have acted — and whether the
   * command this request came from can be sent twice at all. A consumer branching on {@link networkCode}
   * has to rebuild all three, and the consequence of getting the middle one wrong is a resource created
   * twice, silently.
   *
   * Replayability is what the command declared, not what the method suggests: these APIs have `PUT`
   * endpoints that mail something on every call, and reads served over `POST`. A command that never
   * declared it answers `false`, so an endpoint nobody checked is never replayed on a guess.
   *
   * `false` does not always mean hopeless: a request that is not idempotent but failed on a reset
   * connection would be worth replaying if it could be made safe. {@link retryAdvice} tells those two
   * cases apart.
   *
   * @returns Whether to send the request again, with a backoff
   */
  isWorthRetrying(): boolean {
    switch (this.retryAdvice) {
      case 'retry':
        return true;
      case 'do-not-retry':
        return false;
      case 'retry-if-idempotent':
        return this.request.isIdempotent;
    }
  }
}

/**
 * Error class for HTTP-specific errors in the Clever Cloud client.
 * Extends CcRequestError with HTTP response information.
 *
 * Used for errors that occur when a request receives an error response
 * from the server (non-2xx status codes).
 */
export class CcHttpError extends CcRequestError {
  #response: CcResponse<unknown>;

  /**
   * Creates a new HTTP error.
   *
   * @param message - Human-readable error description
   * @param code - Machine-readable error code
   * @param request - The HTTP request that caused the error
   * @param response - The HTTP response
   */
  constructor(message: string, code: string, request: CcRequest, response: CcResponse<unknown>) {
    super(message, code, request);
    this.#response = response;
  }

  /**
   * Gets the HTTP status code from the error response.
   *
   * @returns The HTTP status code
   */
  get statusCode(): number {
    return this.#response.status;
  }

  /**
   * Gets the complete HTTP response associated with this error.
   *
   * @returns The HTTP response that caused the error
   */
  get response(): CcResponse<unknown> {
    return this.#response;
  }
}
