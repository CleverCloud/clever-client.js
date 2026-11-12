import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.ts';
import type { ListKeyElement } from './list-key.types.ts';

/**
 * The element to update
 */
export interface UpdateListKeyElementCommandInput extends RedisHttpCommandInput, WithKey, ListKeyElement {}

/**
 * The updated element
 */
export interface UpdateListKeyElementCommandOutput extends WithKey, ListKeyElement {}
