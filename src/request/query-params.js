export class QueryParams {
  /** @type {Map<string, string | Array<string>>} */
  #queryParams = new Map();

  /**
   * @param {Record<string, string | Array<string>>} [params]
   */
  constructor (params) {
    if (params != null) {
      this.setParams(params);
    }
  }

  /**
   * @param {string} param
   * @param {string | Array<string>} value
   * @returns {this}
   */
  set (param, value) {
    this.#queryParams.set(param, value);
    return this;
  }

  /**
   * @param {Record<string, string | Array<string>>} params
   * @returns {this}
   */
  setParams (params) {
    Object.entries(params).forEach(([key, value]) => {
      this.set(key, value);
    });
    return this;
  }

  /**
   * @param {string} param
   * @returns {string | Array<string>}
   */
  get (param) {
    return this.#queryParams.get(param);
  }

  /**
   * @param {string} param
   * @param {string | Array<string>} value
   * @returns {QueryParams}
   */
  append (param, value) {
    if (this.#queryParams.has(param)) {
      this.#queryParams.set(param, [
        ...toArray(this.#queryParams.get(param)),
        ...toArray(value),
      ]);
    }
    else {
      this.#queryParams.set(param, value);
    }
    return this;
  }

  /**
   * @param {string} param
   */
  remove (param) {
    this.#queryParams.delete(param);
  }

  entries () {
    return this.#queryParams.entries();
  }

  /**
   * @param {URL} url
   */
  applyOnUrl (url) {
    this.#queryParams.forEach((value, param) => {
      const values = toArray(value);
      values
        .filter((value) => value != null)
        .forEach((value) => {
          url.searchParams.append(param, value);
        });
    });
  }
}

// todo: move to utils
/**
 * @param {string | Array<string>} value
 * @returns {Array<string>}
 */
function toArray (value) {
  return Array.isArray(value) ? value : [value];
}
