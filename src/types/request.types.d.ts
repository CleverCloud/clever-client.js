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

export interface CcResponse<CommandOutput> {
  status: number;
  headers: Headers;
  body: CommandOutput;
  request: CcRequest;
}

export type RequestBody = string | Object;

export type RequestAdapter = <CommandOutput>(request: CcRequest) => Promise<CcResponse<CommandOutput>>;

export type RequestWrapper = <CommandOutput>(
  request: CcRequest,
  handler: RequestAdapter,
) => Promise<CcResponse<CommandOutput>>;

export type DebugConfig = false | true | DebugFunction;

export type DebugFunction = <CommandOutput>(
  request: CcRequest,
  response: CcResponse<CommandOutput>,
  duration: number,
) => void;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
