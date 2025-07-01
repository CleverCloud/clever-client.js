/**
 * @import { UpdateOauthConsumerCommandInput, UpdateOauthConsumerCommandOutput } from './update-oauth-consumer-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOauthConsumer, transformOauthConsumerRightsForApi } from './oauth-consumer-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateOauthConsumerCommandInput, UpdateOauthConsumerCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/consumers/:XXX
 * @group OauthConsumer
 * @version 2
 */
export class UpdateOauthConsumerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateOauthConsumerCommandInput, UpdateOauthConsumerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/consumers/${params.oauthConsumerKey}`, {
      name: params.name,
      description: params.description,
      url: params.url,
      picture: params.picture,
      baseUrl: params.baseUrl,
      rights: transformOauthConsumerRightsForApi(params.rights),
    });
  }

  /** @type {CcApiSimpleCommand<UpdateOauthConsumerCommandInput, UpdateOauthConsumerCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformOauthConsumer(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
