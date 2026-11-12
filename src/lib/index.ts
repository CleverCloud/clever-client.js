/**
 * Everything needed to write a client of your own for another HTTP API: extend {@link CcClient}, and
 * write its commands by extending {@link SimpleCommand}, {@link CompositeCommand} or {@link StreamCommand}.
 *
 * The error classes are exported as types only: narrow an error with the predicates of
 * `@clevercloud/client/utils/error-utils.js`, such as `isCcHttpError()`.
 */

//-- client

export { CcClient } from './cc-client.js';

export type { CcClientConfig, CcClientHooks, CcClientParamsTransformer } from '../types/client.types.js';
export type { OnErrorHook, OnRequestHook, OnResponseHook } from '../types/hook.types.js';

//-- commands

export { AbstractCommand, CompositeCommand, SimpleCommand } from './command/command.js';

export type { ApiErrorInfo, Command, Composer } from '../types/command.types.js';

//-- authentication

export { CcAuth } from './auth/cc-auth.js';

//-- requests

export { HeadersBuilder } from './request/headers-builder.js';
export { QueryParams } from './request/query-params.js';
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
} from './request/request-params-builder.js';
export { safeUrl } from './utils.js';

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
} from '../types/request.types.js';

//-- streams

export { CcStream, CcStreamEvent } from './stream/cc-stream.js';
export { StreamCommand } from './stream/stream-command.js';

export type {
  CcStreamCloseReason,
  CcStreamConfig,
  CcStreamConfigPartial,
  CcStreamRequestFactory,
  CcStreamRetry,
  CcStreamState,
  RetryConfig,
} from './stream/cc-stream.types.js';

//-- errors

export type { CcClientError, CcHttpError, CcNetworkError, CcRequestError } from './error/cc-client-errors.js';
