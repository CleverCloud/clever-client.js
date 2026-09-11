import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Domain } from './domain.types.js';

/**
 * Identifies the application whose primary domain is read. The owner is resolved automatically when
 * omitted.
 */
export type GetPrimaryDomainCommandInput = ApplicationId;

/**
 * The domain explicitly marked as the primary one. The command rejects when the application has none.
 */
export type GetPrimaryDomainCommandOutput = Domain;
