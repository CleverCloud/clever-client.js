import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Identifies the application to attach a domain to, along with the domain itself.
 */
export interface CreateDomainCommandInput extends ApplicationId {
  /** Fully qualified domain name to attach, path included when the domain should route on a prefix. */
  domain: string;
}
