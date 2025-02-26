import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /self/tokens/current
 * @param {Object} params
 */
export function getCurrentTokenInfo() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/tokens/current`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
