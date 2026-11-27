import type { AddonId } from '../../types/cc-api.types.ts';
import type { MysqlInfo } from './mysql.types.ts';

/**
 * Identifies the MySQL add-on to retrieve the details of. A provider-side identifier is resolved to the add-on identifier before the request is sent.
 */
export type GetMysqlInfoCommandInput = AddonId;

/**
 * The details of the MySQL add-on.
 */
export type GetMysqlInfoCommandOutput = MysqlInfo;
