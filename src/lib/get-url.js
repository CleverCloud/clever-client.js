/**
 * @template {string} Api
 * @template Input
 * @abstract
 */
export class GetUrl {
  /** @type {Input} */
  #params;

  /**
   * @param {Input} params
   */
  constructor(params) {
    this.#params = params;
  }

  /**
   * @returns {Input}
   */
  get params() {
    return this.#params;
  }

  /**
   * @param {Input} _params
   * @returns {string}
   * @abstract
   */
  get(_params) {
    throw new Error('Method not implemented');
  }

  /**
   * @returns {Api}
   */
  get api() {
    throw new Error('Method not implemented');
  }
}
