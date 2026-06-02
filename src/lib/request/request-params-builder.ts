import type { CcRequestParams, RequestBody } from '../../types/request.types.js';
import { HeadersBuilder } from './headers-builder.js';
import type { QueryParams } from './query-params.js';

export function get(url: string, queryParams?: QueryParams): Partial<CcRequestParams> {
  return {
    method: 'GET',
    url,
    queryParams,
    headers: new HeadersBuilder().acceptJson().build(),
  };
}

export function post(url: string, body?: unknown, queryParams?: QueryParams): Partial<CcRequestParams> {
  return {
    method: 'POST',
    url,
    queryParams,
    headers: buildHeadersFromBody(body),
    body: body as RequestBody,
  };
}

export function postJson(url: string, body?: unknown, queryParams?: QueryParams): Partial<CcRequestParams> {
  return {
    method: 'POST',
    url,
    queryParams,
    headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
    body: body as RequestBody,
  };
}

export function put(url: string, body?: unknown, queryParams?: QueryParams): Partial<CcRequestParams> {
  return {
    method: 'PUT',
    url,
    queryParams,
    headers: buildHeadersFromBody(body),
    body: body as RequestBody,
  };
}

export function putJson(url: string, body?: unknown, queryParams?: QueryParams): Partial<CcRequestParams> {
  return {
    method: 'PUT',
    url,
    queryParams,
    headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
    body: body as RequestBody,
  };
}

export function patch(url: string, body?: unknown, queryParams?: QueryParams): Partial<CcRequestParams> {
  return {
    method: 'PATCH',
    url,
    queryParams,
    headers: buildHeadersFromBody(body),
    body: body as RequestBody,
  };
}

export function patchJson(url: string, body?: unknown, queryParams?: QueryParams): Partial<CcRequestParams> {
  return {
    method: 'PATCH',
    url,
    queryParams,
    headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
    body: body as RequestBody,
  };
}

export function head(url: string, queryParams?: QueryParams): Partial<CcRequestParams> {
  return {
    method: 'HEAD',
    url,
    queryParams,
  };
}

export function delete_(url: string, queryParams?: QueryParams): Partial<CcRequestParams> {
  return {
    method: 'DELETE',
    url,
    queryParams,
    headers: new HeadersBuilder().acceptJson().build(),
  };
}

function buildHeadersFromBody(body?: unknown): Headers {
  const builder = new HeadersBuilder().acceptJson();

  if (typeof body === 'string') {
    builder.contentTypeTextPlain();
  } else if (body != null) {
    builder.contentTypeJson();
  }

  return builder.build();
}
