import { ApplicationId } from '../../types/cc-api.types.js';
import { Domain } from './domain.types.js';

export interface DeleteDomainCommandInput extends ApplicationId, Domain {}
