/**
 * The details of a Materia KV add-on: a managed key-value database, reached over the Redis protocol with a token.
 */
export interface MateriaInfo {
  /** Identifier of the database. */
  id: string;
  /** Identifier of the Materia cluster hosting the database. */
  clusterId: string;
  /** Identifier of the organisation owning the database. */
  ownerId: string;
  /** Kind of Materia database. Only key-value databases exist so far. */
  kind: 'KV';
  /** Plan the database was provisioned with. */
  plan: 'ALPHA';
  /** Host name the database is reachable at. */
  host: string;
  /** Port the database is reachable on. */
  port: number;
  /** Token to authenticate against the database. */
  token: string;
  /** Identifier of the token, to tell it apart from the tokens issued for other databases. */
  tokenId: string;
  /** Where the database stands in its provisioning lifecycle. */
  status: 'PROVISIONING' | 'PROVISIONED' | 'TO_DELETE' | 'DELETING' | 'DELETED';
}
