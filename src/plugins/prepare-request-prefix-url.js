/**
 * @typedef {import('./plugins.type.js').PrepareRequestPlugin} PrepareRequestPlugin
 */

/**
 * @param {string} prefix
 * @returns {PrepareRequestPlugin}
 */
export function prepareRequestPrefixUrl (prefix) {
  return {
    type: 'prepareRequest',
    handle (requestParams) {
      requestParams.url = `${prefix}${requestParams.url ?? ''}`;
      return requestParams;
    },
  };
}
