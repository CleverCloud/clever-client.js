/**
 * @import { CreateOauthConsumerCommandInput, CreateOauthConsumerCommandOutput } from './create-oauth-consumer-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOauthConsumer, transformOauthConsumerRightsForApi } from './oauth-consumer-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateOauthConsumerCommandInput, CreateOauthConsumerCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/consumers/
 * @group OauthConsumer
 * @version 2
 */
export class CreateOauthConsumerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateOauthConsumerCommandInput, CreateOauthConsumerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/consumers`, {
      name: params.name,
      description: params.description,
      url: params.url,
      picture: params.picture,
      baseUrl: params.baseUrl,
      rights: transformOauthConsumerRightsForApi(params.rights),
    });
  }

  /** @type {CcApiSimpleCommand<CreateOauthConsumerCommandInput, CreateOauthConsumerCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformOauthConsumer(response);
  }
}
