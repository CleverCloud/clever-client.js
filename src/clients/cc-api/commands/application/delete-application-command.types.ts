import type { ApplicationId } from '../../types/cc-api.types.ts';

/**
 * Identifies the application to delete. The owner is resolved automatically when omitted.
 */
export type DeleteApplicationCommandInput = ApplicationId;
