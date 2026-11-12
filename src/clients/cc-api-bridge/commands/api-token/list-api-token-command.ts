import { get } from '../../../../lib/request/request-params-builder.ts';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.ts';
import { transformApiToken } from './api-token-transform.ts';
import type { ListApiTokenCommandOutput } from './list-api-token-command.types.ts';

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
