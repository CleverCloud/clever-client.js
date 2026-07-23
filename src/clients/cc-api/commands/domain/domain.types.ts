/**
 * A domain an application answers on, either a Clever Cloud subdomain or one the owner brought.
 */
export interface Domain {
  /**
   * Fully qualified domain name, path included when the domain routes on a prefix.
   * @renamedFrom `fqdn`
   */
  domain: string;
  /**
   * Whether this is the domain the application should be reached at, the one links point to.
   * Resolved by the command from the favourite domain endpoint: the domain payload does not carry it.
   */
  isPrimary: boolean;
}
