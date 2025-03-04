/**
 * @typedef {import('./plugins.type.js').PrepareRequestPlugin} PrepareRequestPlugin
 * @typedef {import('../request/request.types.js').RequestParams} RequestParams
 */

/**
 * @param {Partial<RequestParams>} defaultParams
 * @returns {PrepareRequestPlugin}
 */
export function prepareRequestWithDefaults (defaultParams) {
  return {
    type: 'prepareRequest',
    handle (requestParams) {
      // todo: should we deep merge headers and query params?
      return {
        ...defaultParams,
        ...requestParams,
      };
    },
  };
}
