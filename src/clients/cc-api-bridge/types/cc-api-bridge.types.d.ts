import type { OauthTokens } from '../../../types/auth.types.js';
import type { CcClientConfig } from '../../../types/client.types.js';
import type { WithOptional } from '../../../types/utils.types.js';

export type CcApiBridgeType = 'cc-api-bridge';

export interface CcApiBridgeClientConfig extends WithOptional<CcClientConfig, 'baseUrl'> {
  oauthTokens: OauthTokens;
}
