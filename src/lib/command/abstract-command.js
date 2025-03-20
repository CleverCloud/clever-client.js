/**
 * @typedef {import('../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @template ResponseBody
 */
export class AbstractCommand {
  // /** @type {[ResponseBody]} this is a hack. Typescript cannot infer a generic type if it is not used in the class */
  // #internal_hack;

  /**
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams() {
    return {};
  }

  /**
   * @returns {boolean}
   */
  is404Success() {
    return false;
  }

  /**
   * @param {any} response
   * @return {ResponseBody} response
   */
  convertResponseBody(response) {
    return response;
  }

  /**
   * @returns {boolean}
   */
  isAuthRequired() {
    return false;
  }
}
