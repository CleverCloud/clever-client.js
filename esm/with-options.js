/**
 * @typedef {import('./request.types.js').RequestParams} RequestParams
 */

/**
 * @param {Partial<RequestParams>} options
 * @returns {(requestParams: RequestParams) => RequestParams}
 */
export function withOptions (options = {}) {
  return (requestParams) => {
    return { ...requestParams, ...options };
  };
}
