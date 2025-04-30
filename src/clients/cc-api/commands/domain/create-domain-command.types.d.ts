import { ApplicationId } from '../../types/cc-api.types.js';

export interface CreateDomainCommandInput extends ApplicationId {
  domain: string;
}
