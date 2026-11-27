import type { AddonId } from '../../types/cc-api.types.ts';
import type { PostgresqlInfo } from './postgresql.types.ts';

/**
 * Identifies the PostgreSQL add-on to retrieve the details of. A provider-side identifier is resolved to the add-on identifier before the request is sent.
 */
export type GetPostgresqlInfoCommandInput = AddonId;

/**
 * The details of the PostgreSQL add-on.
 */
export type GetPostgresqlInfoCommandOutput = PostgresqlInfo;
