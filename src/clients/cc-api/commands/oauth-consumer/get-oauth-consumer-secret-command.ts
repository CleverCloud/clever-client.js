import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetOauthConsumerSecretCommandInput,
  GetOauthConsumerSecretCommandOutput,
} from './get-oauth-consumer-secret-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX/secret
 * @group OauthConsumer
 * @version 2
 */
export class GetOauthConsumerSecretCommand extends CcApiSimpleCommand<
  GetOauthConsumerSecretCommandInput,
  GetOauthConsumerSecretCommandOutput
> {
  toRequestParams(params: GetOauthConsumerSecretCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/consumers/${params.oauthConsumerKey}/secret`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
