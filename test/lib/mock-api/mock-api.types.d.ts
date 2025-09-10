/**
 * Configuration for a mock API endpoint.
 * Defines how the mock server should respond to specific requests.
 *
 * @example
 * const mock = {
 *   request: { method: 'GET', path: '/api/users' },
 *   response: { status: 200, body: [{ id: 1, name: 'John' }] },
 *   throttle: 100 // Optional delay in milliseconds
 * };
 */
export interface Mock {
  /** The request pattern to match */
  request: MockRequest;
  /** The response to return when the request matches */
  response: MockResponse;
  /** Optional delay in milliseconds before responding */
  throttle?: number;
}

/**
 * Defines the request pattern that a mock should match.
 * Used to identify which requests should be handled by a specific mock.
 *
 * @example
 * const request = {
 *   method: 'POST',
 *   path: '/api/applications'
 * };
 */
export interface MockRequest {
  /** HTTP method (GET, POST, PUT, DELETE, etc.) */
  method: string;
  /** URL path to match (can include path parameters) */
  path: string;
}

/**
 * Defines the response that a mock should return.
 * Includes status code and optional response body.
 *
 * @example
 * const response = {
 *   status: 201,
 *   body: { id: 'app_123', name: 'My App' }
 * };
 */
export interface MockResponse {
  /** HTTP status code to return */
  status: number;
  /** Optional response body (can be any JSON-serializable value) */
  body?: any;
}

/**
 * Represents a recorded API call made during testing.
 * Contains all details about the request that was made and the response that was returned.
 *
 * @template T - Type of the request body
 *
 * @example
 * const call = {
 *   method: 'POST',
 *   path: '/api/applications',
 *   queryParams: { ownerId: 'user_123' },
 *   headers: { 'Content-Type': 'application/json' },
 *   body: { name: 'My App' },
 *   response: { status: 201, body: { id: 'app_123' } }
 * };
 */
export interface MockCall<T = any> {
  /** HTTP method used in the request */
  method: string;
  /** URL path that was requested */
  path: string;
  /** Query parameters included in the request */
  queryParams: Record<string, OneOrMany<string>>;
  /** HTTP headers sent with the request */
  headers: Record<string, OneOrMany<string>>;
  /** Request body data */
  body: T;
  /** Response that was returned (if any) */
  response?: MockResponse;
  /** The matching mock request (if any) */
  matchingMockRequest?: MockRequest;
}

/**
 * Utility type representing a value that can be either a single item or an array of items.
 * Commonly used for HTTP headers and query parameters which can have multiple values.
 *
 * @template T - The type of the value(s)
 */
export type OneOrMany<T> = T | Array<T>;
