import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetOauthConsumerCommandInput,
  GetOauthConsumerCommandOutput,
} from './get-oauth-consumer-command.types.js';
import { GetOauthConsumerSecretCommand } from './get-oauth-consumer-secret-command.js';
import { transformOauthConsumer } from './oauth-consumer-transform.js';
import type { OauthConsumer } from './oauth-consumer.types.js';

/**
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

    if (oauthConsumer == null) {
      return null;
    }

    if (params.withSecret) {
      if (secret == null) {
        return null;
      }
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
}

/**
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX
 * @group OauthConsumer
 * @version 2
 */
class GetOauthConsumerInnerCommand extends CcApiSimpleCommand<GetOauthConsumerCommandInput, OauthConsumer> {
  toRequestParams(params: GetOauthConsumerCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/consumers/${params.oauthConsumerKey}`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): OauthConsumer {
    return transformOauthConsumer(response);
  }
}
