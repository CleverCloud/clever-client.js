import { put } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.ts';
import type { UpdateApiTokenCommandInput } from './update-api-token-command.types.ts';

/**
 * Renames an API token, or changes the note attached to it.
 *
 * @endpoint [PUT] /api-tokens/:XXX
 * @group ApiToken
 */
export class UpdateApiTokenCommand extends CcApiBridgeCommand<UpdateApiTokenCommandInput, undefined> {
  toRequestParams(params: UpdateApiTokenCommandInput) {
    return put(safeUrl`/api-tokens/${params.apiTokenId}`, {
      name: params.name,
      description: params.description,
    });
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // the name and description are written over the stored token, so a replay lands on the same values
  isIdempotent(): boolean {
    return true;
  }
}
