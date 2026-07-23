import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Identifies the application whose primary domain is cleared. The owner is resolved automatically
 * when omitted.
 */
export type UnsetPrimaryDomainCommandInput = ApplicationId;
