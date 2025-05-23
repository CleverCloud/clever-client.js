/**
 * @import { UpdateOauthConsumerCommandInput, UpdateOauthConsumerCommandOutput } from './update-oauth-consumer-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

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
    return put(safeUrl`/v2/organisations/:XXX/consumers/:XXX`, {});
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
