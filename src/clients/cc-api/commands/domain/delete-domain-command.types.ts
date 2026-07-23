import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Identifies the application to detach a domain from, along with the domain itself.
 */
export interface DeleteDomainCommandInput extends ApplicationId {
  /** Fully qualified domain name to detach, exactly as it was attached. */
  domain: string;
}
