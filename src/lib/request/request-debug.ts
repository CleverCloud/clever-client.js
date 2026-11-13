import type { CcRequest, CcResponse, RequestAdapter } from '../../types/request.types.ts';
import { QueryParams } from './query-params.ts';

export async function requestDebug<CommandOutput>(
  request: CcRequest,
  handler: RequestAdapter,
): Promise<CcResponse<CommandOutput>> {
  if (!request.isDebugEnabled) {
    return handler<CommandOutput>(request);
  }

  const response = await handler<CommandOutput>(request);
  // oxlint-disable-next-line no-console -- printing the request is what the debug mode is for
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

function obfuscateHeaders(headers?: Headers): Record<string, string> | undefined {
  if (headers == null) {
    return undefined;
  }
  if (headers.get('authorization') != null) {
    return { ...Object.fromEntries(headers.entries()), authorization: '***' };
  }
  return Object.fromEntries(headers.entries());
}

function obfuscateQueryParams(queryParams?: QueryParams): Record<string, unknown> | undefined {
  if (queryParams == null) {
    return undefined;
  }

  if (queryParams.get('authorization') != null) {
    return new QueryParams(queryParams).set('authorization', '***').toObject();
  }
  return queryParams.toObject();
}
