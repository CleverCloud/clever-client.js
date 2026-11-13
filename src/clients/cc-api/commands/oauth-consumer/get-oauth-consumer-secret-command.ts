import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  GetOauthConsumerSecretCommandInput,
  GetOauthConsumerSecretCommandOutput,
} from './get-oauth-consumer-secret-command.types.ts';

/**
 * Retrieves the secret of an OAuth consumer.
 *
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX/secret
 * @group OauthConsumer
 * @version 2
 */
export class GetOauthConsumerSecretCommand extends CcApiSimpleCommand<
  GetOauthConsumerSecretCommandInput,
  GetOauthConsumerSecretCommandOutput
> {
  toRequestParams(params: GetOauthConsumerSecretCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/consumers/${params.oauthConsumerKey}/secret`);
  }

  transformCommandOutput(response: unknown): GetOauthConsumerSecretCommandOutput {
    const payload = response as { secret: string };
    return {
      secret: payload.secret,
    };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  // the stored secret is read back as is, never rotated
  isIdempotent(): boolean {
    return true;
  }
}
