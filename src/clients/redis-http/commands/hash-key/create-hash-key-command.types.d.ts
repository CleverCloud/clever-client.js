import type { RedisHttpCommandInput } from '../../types/redis-http.types.js';
import type { HashKey } from './hash-key.types.js';

/**
 * The key and its fields to create
 */
export interface CreateHashKeyCommandInput extends RedisHttpCommandInput, HashKey {}

/**
 * The created key and its fields
 */
export type CreateHashKeyCommandOutput = HashKey;
