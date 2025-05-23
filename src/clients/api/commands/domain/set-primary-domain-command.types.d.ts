import { ApplicationId } from '../../types/cc-api.types.js';
import type { Domain } from './domain.types.js';

export interface SetPrimaryDomainCommandInput extends ApplicationId, Domain {}
