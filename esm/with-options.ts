import type { RequestParams } from './request.types.ts';

export function withOptions(options: Partial<RequestParams> = {}): (requestParams: RequestParams) => RequestParams {
  return (requestParams) => {
    return { ...requestParams, ...options };
  };
}
