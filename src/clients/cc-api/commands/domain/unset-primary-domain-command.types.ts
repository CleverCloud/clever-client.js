import type { ApplicationId } from '../../types/cc-api.types.ts';

/**
 * Identifies the application whose primary domain is cleared. The owner is resolved automatically
 * when omitted.
 */
export type UnsetPrimaryDomainCommandInput = ApplicationId;
