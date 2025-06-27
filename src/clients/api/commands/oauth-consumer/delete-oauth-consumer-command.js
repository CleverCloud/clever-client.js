/**
 * @import { DeleteOauthConsumerCommandInput } from './delete-oauth-consumer-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteOauthConsumerCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/consumers/:XXX
 * @group OauthConsumer
 * @version 2
 */
export class DeleteOauthConsumerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteOauthConsumerCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/consumers/${params.oauthConsumerKey}`);
  }

  /** @type {CcApiSimpleCommand<DeleteOauthConsumerCommandInput, void>['toRequestParams']} */
  transformCommandOutput() {
    return null;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
