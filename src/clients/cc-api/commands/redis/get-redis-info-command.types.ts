import type { AddonId } from '../../types/cc-api.types.ts';
import type { RedisInfo } from './redis.types.ts';

/**
 * Identifies the Redis add-on to retrieve the details of. A provider-side identifier is resolved to the add-on identifier before the request is sent.
 */
export type GetRedisInfoCommandInput = AddonId;

/**
 * The details of the Redis add-on.
 */
export type GetRedisInfoCommandOutput = RedisInfo;
