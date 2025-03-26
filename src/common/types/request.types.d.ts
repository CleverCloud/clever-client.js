import type { QueryParams } from '../lib/request/query-params.js';

export type CcRequest = CcRequestParams & CcRequestConfig;

export interface CcRequestParams {
  method: HttpMethod;
  url: string;
  headers?: Headers;
  queryParams?: QueryParams;
  body?: RequestBody;
}

export interface CcRequestConfig {
  cors: boolean;
  timeout: number;
  cache: boolean | 'reload';
  cacheDelay: number;
  signal?: AbortSignal;
  debug: DebugConfig;
}

export interface CcResponse<ResponseBody> {
  status: number;
  headers: Headers;
  body: ResponseBody;
  request: CcRequest;
}

export type RequestBody = string | Object;

export type RequestAdapter = <ResponseBody>(request: CcRequest) => Promise<CcResponse<ResponseBody>>;

export type RequestWrapper = <ResponseBody>(
  request: CcRequest,
  handler: RequestAdapter,
) => Promise<CcResponse<ResponseBody>>;

export type DebugConfig = false | true | ((...args: any[]) => void);

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
