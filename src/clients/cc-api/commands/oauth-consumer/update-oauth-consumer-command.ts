import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformOauthConsumer, transformOauthConsumerRightsForApi } from './oauth-consumer-transform.js';
import type {
  UpdateOauthConsumerCommandInput,
  UpdateOauthConsumerCommandOutput,
} from './update-oauth-consumer-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/consumers/:XXX
 * @group OauthConsumer
 * @version 2
 */
export class UpdateOauthConsumerCommand extends CcApiSimpleCommand<
  UpdateOauthConsumerCommandInput,
  UpdateOauthConsumerCommandOutput
> {
  toRequestParams(params: UpdateOauthConsumerCommandInput) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/consumers/${params.oauthConsumerKey}`, {
      name: params.name,
      description: params.description,
      url: params.url,
      picture: params.picture,
      baseUrl: params.baseUrl,
      rights: transformOauthConsumerRightsForApi(params.rights),
    });
  }

  transformCommandOutput(response: unknown): UpdateOauthConsumerCommandOutput {
    return transformOauthConsumer(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
