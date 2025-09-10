import { ApplicationId } from '../../types/cc-api.types.js';
import { Domain } from './domain.types.js';

export interface ListDomainCommandInput extends ApplicationId {}

export type ListDomainCommandOutput = Array<Domain>;
