import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';
import { transformApiToken } from './api-token-transform.js';
import type { ListApiTokenCommandOutput } from './list-api-token-command.types.js';

/**
 * List API tokens
 *
 * @endpoint [GET] /api-tokens
 * @group ApiToken
 */
export class ListApiTokenCommand extends CcApiBridgeCommand<void, ListApiTokenCommandOutput> {
  toRequestParams() {
    return get(`/api-tokens`);
  }

  transformCommandOutput(response: unknown): ListApiTokenCommandOutput {
    return (response as Array<unknown>).map(transformApiToken);
  }
}
