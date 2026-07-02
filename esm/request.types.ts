import type { QueryParams } from './utils/query-params.types.js';

export interface RequestParams extends Omit<RequestInit, 'headers' | 'body'> {
  url: string;
  headers?: Record<string, string>;
  body?: object | string;
  queryParams?: QueryParams;
  timeout?: number;
}

export interface RequestError extends Error {
  id?: string;
  response: Response;
  responseBody: any;
}
