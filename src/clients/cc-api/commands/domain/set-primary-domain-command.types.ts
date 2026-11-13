import type { ApplicationId } from '../../types/cc-api.types.ts';

/**
 * Identifies the application, along with the domain that should become its primary one.
 */
export interface SetPrimaryDomainCommandInput extends ApplicationId {
  /** Fully qualified domain name to promote. It has to be attached to the application already. */
  domain: string;
}
