import type { RequestParams } from './request.types.js';

export function prefixUrl(prefix: string): (requestParams: RequestParams) => RequestParams {
  return function (requestParams) {
    const { url = '' } = requestParams;
    return {
      ...requestParams,
      url: `${prefix}${url}`,
    };
  };
}
