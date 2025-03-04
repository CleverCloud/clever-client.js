import type { RequestParams, Response, RequestAdapter } from "../request/request.types.js";

export type Plugin = PrepareRequestPlugin | OnResponsePlugin | OnErrorPlugin | RequestWrapperPlugin;

export interface PrepareRequestPlugin {
  type: 'prepareRequest';
  handle(requestParams: Partial<RequestParams>): SelfOrPromise<Partial<RequestParams>>;
}

export interface OnResponsePlugin {
  type: 'onResponse';
  handle<ResponseBody>(response: Response<ResponseBody>): SelfOrPromise<void>;
}

export interface OnErrorPlugin {
  type: 'onError';
  handle(error: any): SelfOrPromise<void>;
}

export interface RequestWrapperPlugin {
  type: 'requestWrapper';
  handle<ResponseBody>(requestParams: Partial<RequestParams>, handler: RequestAdapter): Promise<Response<ResponseBody>>;
}

type SelfOrPromise<T> = T | Promise<T>;
