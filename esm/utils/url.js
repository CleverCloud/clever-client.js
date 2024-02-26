/**
 * transform URLSearchParams into object with array values when needed
 * @param {URLSearchParams} searchParams
 * @returns {Object.<string, any>}
 */
export function urlSearchParamsToObject (searchParams) {
  searchParams.sort();
  const result = {};

  for (const [k, v] of searchParams.entries()) {
    const old = result[k];
    if (Array.isArray(old)) {
      result[k].push(v);
    }
    else if (old === undefined) {
      result[k] = v;
    }
    else {
      result[k] = [old, v];
    }
  }

  return result;
}
