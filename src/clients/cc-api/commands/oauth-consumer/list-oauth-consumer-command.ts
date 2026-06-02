import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { GetOauthConsumerSecretCommand } from './get-oauth-consumer-secret-command.js';
import type {
  ListOauthConsumerCommandInput,
  ListOauthConsumerCommandOutput,
} from './list-oauth-consumer-command.types.js';
import { transformOauthConsumer } from './oauth-consumer-transform.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/consumers
 * @endpoint [GET] /v2/organisations/:XXX/consumers
 * @group OauthConsumer
 * @version 2
 */
export class ListOauthConsumerCommand extends CcApiCompositeCommand<
  ListOauthConsumerCommandInput,
  ListOauthConsumerCommandOutput
> {
  async compose(
    params: ListOauthConsumerCommandInput,
    composer: CcApiComposer,
  ): Promise<ListOauthConsumerCommandOutput> {
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
 * @endpoint [GET] /v2/organisations/:XXX/consumers
 * @group OauthConsumer
 * @version 2
 */
class ListOauthConsumerInnerCommand extends CcApiSimpleCommand<
  ListOauthConsumerCommandInput,
  ListOauthConsumerCommandOutput
> {
  toRequestParams(params: ListOauthConsumerCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/consumers`);
  }

  transformCommandOutput(response: unknown): ListOauthConsumerCommandOutput {
    return sortBy((response as Array<unknown>).map(transformOauthConsumer), 'name');
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
