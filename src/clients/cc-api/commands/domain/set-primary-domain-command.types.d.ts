import { ApplicationId } from '../../types/cc-api.types.js';

export interface SetPrimaryDomainCommandInput extends ApplicationId {
  domain: string;
}
