import type { CcRequest, CcResponse, RequestAdapter } from '../../types/request.types.js';
import { QueryParams } from './query-params.js';

export async function requestDebug<CommandOutput>(
  request: CcRequest,
  handler: RequestAdapter,
): Promise<CcResponse<CommandOutput>> {
  if (!request.debug) {
    return handler<CommandOutput>(request);
  }

  const response = await handler<CommandOutput>(request);
  console.log(
    JSON.stringify(
      {
        request: {
          ...request,
          queryParams: obfuscateQueryParams(request.queryParams),
          headers: obfuscateHeaders(request.headers),
        },
        response: {
          ...response,
          headers: obfuscateHeaders(response.headers),
        },
      },
      null,
      2,
    ),
  );

  return response;
}

function obfuscateHeaders(headers: Headers): Record<string, string> | null {
  if (headers == null) {
    return null;
  }
  if (headers.get('authorization') != null) {
    return { ...Object.fromEntries(headers.entries()), authorization: '***' };
  }
  return Object.fromEntries(headers.entries());
}

function obfuscateQueryParams(queryParams: QueryParams): Record<string, unknown> | null {
  if (queryParams == null) {
    return null;
  }

  if (queryParams.get('authorization') != null) {
    return new QueryParams(queryParams).set('authorization', '***').toObject();
  }
  return queryParams.toObject();
}
