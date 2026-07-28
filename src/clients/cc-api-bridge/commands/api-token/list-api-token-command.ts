import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';
import { transformApiToken } from './api-token-transform.js';
import type { ListApiTokenCommandOutput } from './list-api-token-command.types.js';

/**
 * Lists the API tokens of the current user, without their values.
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

  isIdempotent(): boolean {
    return true;
  }
}
