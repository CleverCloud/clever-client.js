import type { ApplicationId } from '../../types/cc-api.types.ts';
import type { Domain } from './domain.types.ts';

/**
 * Identifies the application whose domains are listed. The owner is resolved automatically when
 * omitted.
 */
export type ListDomainCommandInput = ApplicationId;

/**
 * The domains attached to the application, sorted by domain, each flagged as primary or not.
 */
export type ListDomainCommandOutput = Array<Domain>;
