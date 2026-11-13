import type { CcRequest, CcResponse } from '../../src/types/request.types.ts';

/**
 * Brands a class the way another copy of `@clevercloud/client` brands its own: with the same
 * `Symbol.for()` keys, on a class this copy never defined, so that `instanceof` cannot recognize its
 * instances and only the brand can.
 *
 * The keys are spelled out rather than taken from `createBrand()`: they are a contract between
 * versions, and a test has to fail if one of them changes.
 *
 * @param prototype - The prototype of the class to brand
 * @param kinds - The kinds the class belongs to, its own and those of the classes it stands for extending
 */
export function brandAsForeignCopy(prototype: object, ...kinds: Array<string>): void {
  for (const kind of kinds) {
    Object.defineProperty(prototype, Symbol.for(`@clevercloud/client/${kind}`), { value: true });
  }
}

/** A `CcClientError` raised by another copy of the client. */
export class ForeignCcClientError extends Error {
  static {
    brandAsForeignCopy(this.prototype, 'CcClientError');
  }

  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

/** A `CcRequestError` raised by another copy of the client. */
export class ForeignCcRequestError extends ForeignCcClientError {
  static {
    brandAsForeignCopy(this.prototype, 'CcRequestError');
  }

  readonly request: CcRequest;

  constructor(message: string, code: string, request: CcRequest) {
    super(message, code);
    this.request = request;
  }
}

/** A `CcNetworkError` raised by another copy of the client. */
export class ForeignCcNetworkError extends ForeignCcRequestError {
  static {
    brandAsForeignCopy(this.prototype, 'CcNetworkError');
  }

  constructor(request: CcRequest) {
    super('A network error occurred while fetching HTTP endpoint', 'NETWORK_ERROR', request);
  }
}

/** A `CcHttpError` raised by another copy of the client. */
export class ForeignCcHttpError extends ForeignCcRequestError {
  static {
    brandAsForeignCopy(this.prototype, 'CcHttpError');
  }

  readonly response: CcResponse<unknown>;

  constructor(code: string, request: CcRequest, response: CcResponse<unknown>) {
    super(`Error ${response.status}`, code, request);
    this.response = response;
  }

  get statusCode(): number {
    return this.response.status;
  }
}
