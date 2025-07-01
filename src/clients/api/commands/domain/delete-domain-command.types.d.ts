import { ApplicationId } from '../../types/cc-api.types.js';

export interface DeleteDomainCommandInput extends ApplicationId {
  domain: string;
}
