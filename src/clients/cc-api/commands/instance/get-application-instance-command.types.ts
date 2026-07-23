import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Instance } from './instance.types.js';

/**
 * Identifies the instance to retrieve. The owner is resolved automatically when omitted.
 */
export interface GetApplicationInstanceCommandInput extends ApplicationId {
  /** Identifier of the instance to retrieve, a bare UUID. */
  instanceId: string;
}

/**
 * The requested instance.
 */
export type GetApplicationInstanceCommandOutput = Instance;
