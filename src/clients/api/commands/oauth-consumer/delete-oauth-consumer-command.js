/**
 * @import { DeleteOauthConsumerCommandInput, DeleteOauthConsumerCommandOutput } from './delete-oauth-consumer-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteOauthConsumerCommandInput, DeleteOauthConsumerCommandOutput>}
 * @endpoint [DELETE] /v2/organisations/:XXX/consumers/:XXX
 * @group OauthConsumer
 * @version 2
 */
export class DeleteOauthConsumerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteOauthConsumerCommandInput, DeleteOauthConsumerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/:XXX/consumers/:XXX`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
