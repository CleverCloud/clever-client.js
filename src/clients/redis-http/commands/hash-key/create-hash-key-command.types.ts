import type { RedisHttpCommandInput } from '../../types/redis-http.types.ts';
import type { HashKey } from './hash-key.types.ts';

/**
 * The key and its fields to create
 */
export interface CreateHashKeyCommandInput extends RedisHttpCommandInput, HashKey {}

/**
 * The created key and its fields
 */
export type CreateHashKeyCommandOutput = HashKey;
