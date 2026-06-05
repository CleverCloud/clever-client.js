import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteOauthConsumerCommandInput } from './delete-oauth-consumer-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/consumers/:XXX
 * @group OauthConsumer
 * @version 2
 */
export class DeleteOauthConsumerCommand extends CcApiSimpleCommand<DeleteOauthConsumerCommandInput, undefined> {
  toRequestParams(params: DeleteOauthConsumerCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/consumers/${params.oauthConsumerKey}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
