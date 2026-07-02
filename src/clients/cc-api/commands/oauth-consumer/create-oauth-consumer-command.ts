import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  CreateOauthConsumerCommandInput,
  CreateOauthConsumerCommandOutput,
} from './create-oauth-consumer-command.types.js';
import { transformOauthConsumer, transformOauthConsumerRightsForApi } from './oauth-consumer-transform.js';

/**
 * @endpoint [POST] /v2/organisations/:XXX/consumers/
 * @group OauthConsumer
 * @version 2
 */
export class CreateOauthConsumerCommand extends CcApiSimpleCommand<
  CreateOauthConsumerCommandInput,
  CreateOauthConsumerCommandOutput
> {
  toRequestParams(params: CreateOauthConsumerCommandInput) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/consumers`, {
      name: params.name,
      description: params.description,
      url: params.url,
      picture: params.picture,
      baseUrl: params.baseUrl,
      rights: transformOauthConsumerRightsForApi(params.rights),
    });
  }

  transformCommandOutput(response: unknown): CreateOauthConsumerCommandOutput {
    return transformOauthConsumer(response);
  }
}
