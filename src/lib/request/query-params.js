/**
 * @import { QueryParamValue } from '../../types/request.types.js'
 * @import { OneOrMany } from '../../types/utils.types.js'
 */
import { toArray } from '../utils.js';

export class QueryParams {
  /** @type {Map<string, OneOrMany<QueryParamValue>>} */
  #queryParams = new Map();

  /**
   * @param {Record<string, OneOrMany<QueryParamValue>>|QueryParams} [params]
   */
  constructor(params) {
    if (params != null) {
      if (params instanceof QueryParams) {
        this.setParams(params.toObject());
      } else {
        this.setParams(params);
      }
    }
  }

  /**
   * @param {string} param
   * @param {OneOrMany<QueryParamValue>} value
   * @returns {this}
   */
  set(param, value) {
    this.#queryParams.set(param, value);
    return this;
  }

  /**
   * @param {Record<string, OneOrMany<QueryParamValue>>} params
   * @returns {this}
   */
  setParams(params) {
    Object.entries(params).forEach(([key, value]) => {
      this.set(key, value);
    });
    return this;
  }

  /**
   * @param {string} param
   * @returns {OneOrMany<QueryParamValue>}
   */
  get(param) {
    return this.#queryParams.get(param);
  }

  /**
   * @param {string} param
   * @param {OneOrMany<QueryParamValue>} value
   * @returns {QueryParams}
   */
  append(param, value) {
    if (this.#queryParams.has(param)) {
      this.#queryParams.set(param, [...toArray(this.#queryParams.get(param)), ...toArray(value)]);
    } else {
      this.#queryParams.set(param, value);
    }
    return this;
  }

  /**
   * @param {string} param
   */
  remove(param) {
    this.#queryParams.delete(param);
  }

  entries() {
    return this.#queryParams.entries();
  }

  /**
   * @param {URL} url
   */
  applyOnUrl(url) {
    this.#queryParams.forEach((value, param) => {
      const values = toArray(value);
      values
        .filter((value) => value != null)
        .forEach((value) => {
          url.searchParams.append(param, String(value));
        });
    });
  }

  toObject() {
    return Object.fromEntries(
      Array.from(this.#queryParams.entries())
        .map(function ([key, value]) {
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
