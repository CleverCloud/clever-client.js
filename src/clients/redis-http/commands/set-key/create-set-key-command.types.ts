import type { RedisHttpCommandInput } from '../../types/redis-http.types.js';
import type { SetKey } from './set-key.types.js';

/**
 * The key and its members to create
 */
export type CreateSetKeyCommandInput = RedisHttpCommandInput & SetKey;

/**
 * The created key and its members
 */
export type CreateSetKeyCommandOutput = SetKey;
