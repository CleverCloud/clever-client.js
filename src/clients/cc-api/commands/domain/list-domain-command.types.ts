import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Domain } from './domain.types.js';

export type ListDomainCommandInput = ApplicationId;

// transformed: sorted by domain
export type ListDomainCommandOutput = Array<Domain>;
