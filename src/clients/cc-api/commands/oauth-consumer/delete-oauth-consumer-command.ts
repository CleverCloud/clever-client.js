import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { DeleteOauthConsumerCommandInput } from './delete-oauth-consumer-command.types.ts';

/**
 * Removes an OAuth consumer, revoking every token issued through it.
 *
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

  // the consumer is marked deleted and its tokens revoked, so a replay only meets a not-found error
  isIdempotent(): boolean {
    return true;
  }
}
