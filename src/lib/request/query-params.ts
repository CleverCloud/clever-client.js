import type { QueryParamValue } from '../../types/request.types.js';
import type { OneOrMany } from '../../types/utils.types.js';
import { createBrand, hasBrand, setBrand, toArray } from '../utils.js';

// A cross-version contract, see createBrand()
const QUERY_PARAMS_BRAND = createBrand('QueryParams');

export class QueryParams {
  static {
    setBrand(this.prototype, QUERY_PARAMS_BRAND);
  }

  #queryParams = new Map<string, OneOrMany<QueryParamValue> | undefined>();

  constructor(params?: Record<string, OneOrMany<QueryParamValue>> | QueryParams) {
    if (params != null) {
      if (isQueryParams(params)) {
        this.setParams(params.toObject());
      } else {
        this.setParams(params);
      }
    }
  }

  set(param: string, value: OneOrMany<QueryParamValue> | undefined): this {
    this.#queryParams.set(param, value);
    return this;
  }

  setParams(params: Record<string, OneOrMany<QueryParamValue> | undefined>): this {
    Object.entries(params).forEach(([key, value]) => {
      this.set(key, value);
    });
    return this;
  }

  get(param: string): OneOrMany<QueryParamValue> | undefined {
    return this.#queryParams.get(param);
  }

  append(param: string, value: OneOrMany<QueryParamValue> | undefined): this {
    if (value == null) {
      return this;
    }
    if (this.#queryParams.has(param)) {
      this.#queryParams.set(param, [...toArray(this.#queryParams.get(param)), ...toArray(value)]);
    } else {
      this.#queryParams.set(param, value);
    }
    return this;
  }

  remove(param: string): void {
    this.#queryParams.delete(param);
  }

  entries(): MapIterator<[string, OneOrMany<QueryParamValue> | undefined]> {
    return this.#queryParams.entries();
  }

  applyOnUrl(url: URL): void {
    this.#queryParams.forEach((value, param) => {
      const values = toArray(value);
      values
        .filter((value) => value != null)
        .forEach((value) => {
          url.searchParams.append(param, String(value));
        });
    });
  }

  toObject(): Record<string, QueryParamValue | Array<QueryParamValue>> {
    return Object.fromEntries(
      Array.from(this.#queryParams.entries())
        .map(function ([key, value]): [string, QueryParamValue | Array<QueryParamValue>] | null {
          if (value == null) {
            return null;
          }
          const values = toArray(value).filter((value) => value != null);
          if (values.length === 0) {
            return null;
          }
          return [key, values.length === 1 ? values[0] : values];
        })
        .filter((entry) => entry != null),
    );
  }
}

/**
 * Whether the given value is a {@link QueryParams}, whichever copy of this package created it.
 *
 * @param value - The value to test
 */
export function isQueryParams(value: unknown): value is QueryParams {
  return hasBrand(value, QUERY_PARAMS_BRAND);
}
