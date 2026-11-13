import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { CcApiComposer } from '../../types/cc-api.types.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  GetOauthConsumerCommandInput,
  GetOauthConsumerCommandOutput,
} from './get-oauth-consumer-command.types.ts';
import { GetOauthConsumerSecretCommand } from './get-oauth-consumer-secret-command.ts';
import { transformOauthConsumer } from './oauth-consumer-transform.ts';
import type { OauthConsumer } from './oauth-consumer.types.ts';

/**
 * Retrieves an OAuth consumer, optionally with its secret.
 *
 * The secret lives behind its own endpoint, so asking for it costs one extra request.
 *
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX/secret
 * @group OauthConsumer
 * @version 2
 */
export class GetOauthConsumerCommand extends CcApiCompositeCommand<
  GetOauthConsumerCommandInput,
  GetOauthConsumerCommandOutput
> {
  async compose(params: GetOauthConsumerCommandInput, composer: CcApiComposer): Promise<GetOauthConsumerCommandOutput> {
    const [oauthConsumer, secret] = await Promise.all([
      composer.send(new GetOauthConsumerInnerCommand(params)),
      params.withSecret ? composer.send(new GetOauthConsumerSecretCommand(params)) : null,
    ]);

    if (params.withSecret) {
      return {
        ...oauthConsumer,
        ...secret,
      };
    }

    return oauthConsumer;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Retrieves an OAuth consumer, without its secret.
 *
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX
 * @group OauthConsumer
 * @version 2
 */
class GetOauthConsumerInnerCommand extends CcApiSimpleCommand<GetOauthConsumerCommandInput, OauthConsumer> {
  toRequestParams(params: GetOauthConsumerCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/consumers/${params.oauthConsumerKey}`);
  }

  transformCommandOutput(response: unknown): OauthConsumer {
    return transformOauthConsumer(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
