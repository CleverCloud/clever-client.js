import { QueryParams } from './utils/query-params.types.js';

export interface RequestParams extends Omit<RequestInit, 'headers' | 'body'> {
  url: string;
  headers?: Record<string, string>;
  body?: Object | string;
  queryParams?: QueryParams;
  timeout?: number;
}

export interface RequestError extends Error {
  id?: string;
  response: Response;
  responseBody: any;
}
