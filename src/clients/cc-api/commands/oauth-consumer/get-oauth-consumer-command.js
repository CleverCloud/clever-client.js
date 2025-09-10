/**
 * @import { GetOauthConsumerCommandInput, GetOauthConsumerCommandOutput } from './get-oauth-consumer-command.types.js';
 * @import { OauthConsumer } from './oauth-consumer.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { GetOauthConsumerSecretCommand } from './get-oauth-consumer-secret-command.js';
import { transformOauthConsumer } from './oauth-consumer-transform.js';

/**
 * @extends {CcApiCompositeCommand<GetOauthConsumerCommandInput, GetOauthConsumerCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX/secret
 * @group OauthConsumer
 * @version 2
 */
export class GetOauthConsumerCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<GetOauthConsumerCommandInput, GetOauthConsumerCommandOutput>['compose']} */
  async compose(params, composer) {
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

  /** @type {CcApiCompositeCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}

/**
 * @extends {CcApiSimpleCommand<GetOauthConsumerCommandInput, OauthConsumer>}
 * @endpoint [GET] /v2/organisations/:XXX/consumers/:XXX
 * @group OauthConsumer
 * @version 2
 */
class GetOauthConsumerInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetOauthConsumerCommandInput, OauthConsumer>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/consumers/${params.oauthConsumerKey}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetOauthConsumerCommandInput, OauthConsumer>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformOauthConsumer(response);
  }
}
