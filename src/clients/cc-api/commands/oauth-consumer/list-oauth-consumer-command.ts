import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { CcApiComposer } from '../../types/cc-api.types.ts';
import { GetOauthConsumerSecretCommand } from './get-oauth-consumer-secret-command.ts';
import type {
  ListOauthConsumerCommandInput,
  ListOauthConsumerCommandOutput,
} from './list-oauth-consumer-command.types.ts';
import { transformOauthConsumer } from './oauth-consumer-transform.ts';

/**
 * Lists the OAuth consumers owned by an organisation, optionally with their secrets.
 *
 * Fetching the secrets costs one extra request per consumer, so it is off by default.
 *
 * @endpoint [GET] /v2/organisations/:XXX/consumers
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX/secret
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

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Lists the OAuth consumers of an organisation, without their secrets.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}
