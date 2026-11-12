import { post } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  CreateOauthConsumerCommandInput,
  CreateOauthConsumerCommandOutput,
} from './create-oauth-consumer-command.types.ts';
import { transformOauthConsumer, transformOauthConsumerRightsForApi } from './oauth-consumer-transform.ts';

/**
 * Registers a new OAuth consumer owned by an organisation.
 *
 * The returned consumer carries its key; the secret has to be fetched separately.
 *
 * @endpoint [POST] /v2/organisations/:XXX/consumers
 * @group OauthConsumer
 * @version 2
 */
export class CreateOauthConsumerCommand extends CcApiSimpleCommand<
  CreateOauthConsumerCommandInput,
  CreateOauthConsumerCommandOutput
> {
  toRequestParams(params: CreateOauthConsumerCommandInput) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/consumers`, {
      name: params.name,
      description: params.description,
      url: params.url,
      picture: params.picture,
      baseUrl: params.baseUrl,
      rights: transformOauthConsumerRightsForApi(params.rights),
    });
  }

  transformCommandOutput(response: unknown): CreateOauthConsumerCommandOutput {
    return transformOauthConsumer(response);
  }

  // each call registers one more consumer, with its own key and secret, and spends a creation quota token
  isIdempotent(): boolean {
    return false;
  }
}
