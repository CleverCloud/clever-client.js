import type { CcRequestParams, CcResponse } from './request.types.js';
import type { SelfOrPromise } from './utils.types.js';

export type PrepareRequestParamsHook = (request: Partial<CcRequestParams>) => SelfOrPromise<Partial<CcRequestParams>>;
export type OnResponseHook = <CommandOutput>(response: CcResponse<CommandOutput>) => SelfOrPromise<void>;
export type OnErrorHook = (error: any) => SelfOrPromise<void>;
