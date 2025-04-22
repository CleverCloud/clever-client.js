/**
 * @typedef {import('../../types/request.types.js').RequestWrapper} RequestWrapper
 * @typedef {import('../../types/request.types.js').DebugFunction} DebugFunction
 */

import { omit } from '../utils.js';

/** @type {DebugFunction} */
const defaultDebug = (request, response, duration) => {
  console.log({ request, response: omit(response, 'request'), duration });
};

/**
 * @type {RequestWrapper}
 */
export const requestDebug = async (request, handler) => {
  if (request.debug === false) {
    return handler(request);
  }

  const debug = request.debug === true ? defaultDebug : request.debug;
  const now = new Date().getTime();
  const response = await handler(request);
  debug(request, response, new Date().getTime() - now);

  return response;
};
