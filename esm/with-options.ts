import type { RequestParams } from './request.types.js';

export function withOptions(options: Partial<RequestParams> = {}): (requestParams: RequestParams) => RequestParams {
  return (requestParams) => {
    return { ...requestParams, ...options };
  };
}
