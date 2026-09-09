import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Identifies the application to stop. The owner is resolved automatically when omitted.
 */
export type UndeployApplicationCommandInput = ApplicationId;
