import type { CcClientConfig } from '../../../types/client.types.js';
import type { WithOptional } from '../../../types/utils.types.js';

export type CcRedisHttpType = 'redis-http';

export type CcRedisHttpClientConfig = WithOptional<CcClientConfig, 'baseUrl'>;
