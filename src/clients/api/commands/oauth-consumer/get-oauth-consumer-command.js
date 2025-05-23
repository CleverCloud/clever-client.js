/**
 * @import { GetOauthConsumerCommandInput, GetOauthConsumerCommandOutput } from './get-oauth-consumer-command.types.js';
 */
import { CcApiCompositeCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<GetOauthConsumerCommandInput, GetOauthConsumerCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX
 * @group OauthConsumer
 * @version 2
 */
export class GetOauthConsumerCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<GetOauthConsumerCommandInput, GetOauthConsumerCommandOutput>['compose']} */
  async compose(params, composer) {}

  /** @type {CcApiCompositeCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
