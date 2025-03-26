/**
 * @typedef {import('../../types/request.types.js').RequestWrapper} RequestWrapper
 */

/**
 * @type {RequestWrapper}
 */
export const requestDebug = async (request, handler) => {
  if (request.debug === false) {
    return handler(request);
  }

  const logger = request.debug === true ? console.log : request.debug;

  logger(request);
  const now = new Date().getTime();
  const result = await handler(request);
  logger(`Took: ${new Date().getTime() - now} ms.`);
  logger(result);
  return result;
};
