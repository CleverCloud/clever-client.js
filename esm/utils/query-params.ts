import type { QueryParams } from './query-params.types.js';

export function fillUrlSearchParams<T>(
  url: URL,
  queryParams: QueryParams<T>,
  formatValue?: (param: T) => string,
): void {
  Object.entries(queryParams || {}).forEach(([k, v]) => {
    const values = Array.isArray(v) ? v : [v];
    values
      .filter((value) => value != null)
      .forEach((value) => {
        url.searchParams.append(k, formatValue ? formatValue(value) : String(value));
      });
  });
}

export function extractQueryParamsFormUrl(url: URL): QueryParams {
  const queryParams: QueryParams = {};
  Array.from(url.searchParams.entries()).forEach(([k, v]) => {
    if (Object.hasOwn(queryParams, k)) {
      if (Array.isArray(queryParams[k])) {
        queryParams[k] = [...queryParams[k], v];
      } else {
        queryParams[k] = [queryParams[k], v];
      }
    } else {
      queryParams[k] = v;
    }
  });

  return queryParams;
}
