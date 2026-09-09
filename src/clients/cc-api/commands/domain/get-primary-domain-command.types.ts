import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Domain } from './domain.types.js';

/**
 * Identifies the application whose primary domain is read. The owner is resolved automatically when
 * omitted.
 */
export type GetPrimaryDomainCommandInput = ApplicationId;

/**
 * The primary domain, or `undefined` when the application has no domain at all.
 */
export type GetPrimaryDomainCommandOutput = Domain;
