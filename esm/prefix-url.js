/**
 * @typedef {import('./request.types.js').RequestParams} RequestParams
 */

/**
 * @param {string} prefix
 * @returns {(requestParams: RequestParams) => RequestParams}
 */
export function prefixUrl (prefix) {
  return function (requestParams) {
    const { url = '' } = requestParams;
    return {
      ...requestParams,
      url: `${prefix}${url}`,
    };
  };
}
