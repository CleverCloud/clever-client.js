import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.ts';
import { transformApiToken } from './api-token-transform.ts';
import type { GetApiTokenCommandInput, GetApiTokenCommandOutput } from './get-api-token-command.types.ts';

/**
 * Retrieves one API token of the current user, without its value.
 *
 * @endpoint [GET] /api-tokens/:XXX
 * @group ApiToken
 */
export class GetApiTokenCommand extends CcApiBridgeCommand<GetApiTokenCommandInput, GetApiTokenCommandOutput> {
  toRequestParams(params: GetApiTokenCommandInput) {
    return get(safeUrl`/api-tokens/${params.apiTokenId}`);
  }

  transformCommandOutput(response: unknown): GetApiTokenCommandOutput {
    return transformApiToken(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
