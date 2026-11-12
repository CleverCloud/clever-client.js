import type { RequestParams } from './request.types.ts';

export interface Warp10RequestParams extends RequestParams {
  body: string;
  responseHandler: (responseBody: any) => any;
}
