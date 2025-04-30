/**
 * @import { ListOauthConsumerCommandInput, ListOauthConsumerCommandOutput } from './list-oauth-consumer-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { GetOauthConsumerSecretCommand } from './get-oauth-consumer-secret-command.js';
import { transformOauthConsumer } from './oauth-consumer-transform.js';

/**
 *
 * @extends {CcApiCompositeCommand<ListOauthConsumerCommandInput, ListOauthConsumerCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/consumers
 * @endpoint [GET] /v2/organisations/:XXX/consumers
 * @group OauthConsumer
 * @version 2
 */
export class ListOauthConsumerCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<ListOauthConsumerCommandInput, ListOauthConsumerCommandOutput>['compose']} */
  async compose(params, composer) {
    const oauthConsumers = await composer.send(new ListOauthConsumerInnerCommand(params));
    if (params.withSecret) {
      return Promise.all(
        oauthConsumers.map((consumer) =>
          composer
            .send(new GetOauthConsumerSecretCommand({ ownerId: params.ownerId, oauthConsumerKey: consumer.key }))
            .then((response) => {
              consumer.secret = response.secret;
              return consumer;
            }),
        ),
      );
    }

    return oauthConsumers;
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<ListOauthConsumerCommandInput, ListOauthConsumerCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/consumers
 * @group OauthConsumer
 * @version 2
 */
class ListOauthConsumerInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListOauthConsumerCommandInput, ListOauthConsumerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/consumers`);
  }

  /** @type {CcApiSimpleCommand<ListOauthConsumerCommandInput, ListOauthConsumerCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformOauthConsumer), 'name');
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
