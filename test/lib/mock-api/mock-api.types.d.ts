export interface Mock {
  request: MockRequest;
  response: MockResponse;
}

export interface MockRequest {
  method: string;
  path: string;
}

export interface MockResponse {
  status: number;
  body?: any;
}

export interface MockCall<T = any> {
  method: string;
  path: string;
  queryParams: Record<string, OneOrMany<string>>;
  headers: Record<string, OneOrMany<string>>;
  body: T;
  response?: MockResponse;
}

export type OneOrMany<T> = T | Array<T>;
