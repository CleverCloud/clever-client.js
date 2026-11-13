/**
 * Everything needed to write a client of your own for another HTTP API: extend {@link CcClient}, and
 * write its commands by extending {@link SimpleCommand}, {@link CompositeCommand} or {@link StreamCommand}.
 *
 * The error classes are exported as types only: narrow an error with the predicates of
 * `@clevercloud/client/utils/error-utils.js`, such as `isCcHttpError()`.
 */

//-- client

export type { CcClientConfig, CcClientHooks, CcClientParamsTransformer } from '../types/client.types.ts';

export type { ApiErrorInfo, Command, Composer } from '../types/command.types.ts';
export type { OnErrorHook, OnRequestHook, OnResponseHook } from '../types/hook.types.ts';

//-- commands

export type {
  CcRequest,
  CcRequestConfig,
  CcRequestConfigPartial,
  CcRequestMetadata,
  CcRequestParams,
  CcResponse,
  HttpMethod,
  QueryParamValue,
  RequestBody,
  RequestCachePolicy,
  SseMessage,
} from '../types/request.types.ts';

export { CcAuth } from './auth/cc-auth.ts';

//-- authentication

export { CcClient } from './cc-client.ts';

//-- requests

export { AbstractCommand, CompositeCommand, SimpleCommand } from './command/command.ts';
export type { CcClientError, CcHttpError, CcNetworkError, CcRequestError } from './error/cc-client-errors.ts';
export { HeadersBuilder } from './request/headers-builder.ts';
export { QueryParams } from './request/query-params.ts';

export {
  delete_,
  get,
  head,
  patch,
  patchJson,
  post,
  postJson,
  put,
  putJson,
} from './request/request-params-builder.ts';

//-- streams

export { CcStream, CcStreamEvent } from './stream/cc-stream.ts';
export type {
  CcStreamCloseReason,
  CcStreamConfig,
  CcStreamConfigPartial,
  CcStreamRequestFactory,
  CcStreamRetry,
  CcStreamState,
  RetryConfig,
} from './stream/cc-stream.types.ts';

export { StreamCommand } from './stream/stream-command.ts';

//-- errors

export { safeUrl } from './utils.ts';
