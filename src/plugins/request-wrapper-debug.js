/**
 * @typedef {import('./plugins.type.js').RequestWrapperPlugin} RequestWrapperPlugin
 */

/**
 * @param {(...args: Array<any>) => void} logger
 * @returns {RequestWrapperPlugin}
 */
export const requestWrapperDebug = (logger) => ({
  type: 'requestWrapper',
  async handle (requestParams, handler) {
    logger(requestParams);
    const now = new Date().getTime();
    const result = await handler(requestParams);
    logger(`Took: ${new Date().getTime() - now} ms.`);
    logger(result);
    return result;
  },
});
