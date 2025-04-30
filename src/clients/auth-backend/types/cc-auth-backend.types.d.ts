import type { OAuthTokens } from '../../../types/auth.types.js';
import type { CcClientConfig } from '../../../types/client.types.js';
import type { WithOptional } from '../../../types/utils.types.js';

export type CcAuthBackendType = 'auth-backend';

export interface CcAuthBackendClientConfig extends WithOptional<CcClientConfig, 'baseUrl'> {
  oAuthTokens: OAuthTokens;
}
