/**
 * @typedef {import('../request/request.types.js').RequestParams} RequestParams
 */

/**
 * @template ResponseBody
 */
export class AbstractCommand {
  /** @type {[ResponseBody]} this is a hack. Typescript cannot infer a generic type if it is not used in the class */
  #internal_hack;

  /**
   * @returns {Partial<RequestParams>}
   */
  toRequestParams () {
    return {};
  }
}
