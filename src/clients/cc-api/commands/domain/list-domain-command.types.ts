import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Domain } from './domain.types.js';

export interface ListDomainCommandInput extends ApplicationId {}

export type ListDomainCommandOutput = Array<Domain>;
