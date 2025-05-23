/**
 * @import { ListOauthConsumerCommandInput, ListOauthConsumerCommandOutput } from './list-oauth-consumer-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListOauthConsumerCommandInput, ListOauthConsumerCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/consumers
 * @group OauthConsumer
 * @version 2
 */
export class ListOauthConsumerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListOauthConsumerCommandInput, ListOauthConsumerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v2/organisations/:XXX/consumers`, {});
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
