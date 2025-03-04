import type { QueryParams } from "./query-params.js";

export interface RequestParams {
  url: string;
  method: string;
  headers: Headers;
  queryParams: QueryParams;
  body: RequestBody;
  cors: boolean;
  timeout: number;
  cacheDelay: number;
  signal: AbortSignal;
}

export interface Response<ResponseBody> {
  status: number;
  headers: Headers;
  body: ResponseBody;
  requestParams: Partial<RequestParams>;
}

export type RequestBody = string | Object;

export type RequestAdapter = <ResponseBody>(requestParams: Partial<RequestParams>) => Promise<Response<ResponseBody>>;
