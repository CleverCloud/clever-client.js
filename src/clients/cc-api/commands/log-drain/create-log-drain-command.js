/**
 * @import { CreateLogDrainCommandInput, CreateLogDrainCommandOutput } from './create-log-drain-command.types.js';
 * @import { LogDrainTarget } from './log-drain.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { GetLogDrainCommand } from './get-log-drain-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<CreateLogDrainCommandInput, CreateLogDrainCommandOutput>}
 * @endpoint [POST] /v4/drains/organisations/:XXX/applications/:XXX/drains
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class CreateLogDrainCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<CreateLogDrainCommandInput, CreateLogDrainCommandOutput>['compose']} */
  async compose(params, composer) {
    const created = await composer.send(new CreateLogDrainInnerCommand(params));

    return composer.send(
      new GetLogDrainCommand({
        applicationId: params.applicationId,
        ownerId: params.ownerId,
        drainId: created.id,
      }),
    );
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<CreateLogDrainCommandInput, {id: string}>}
 * @endpoint [POST] /v4/drains/organisations/:XXX/applications/:XXX/drains
 * @group LogDrain
 * @version 4
 */
class CreateLogDrainInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateLogDrainCommandInput, {id: string}>['toRequestParams']} */
  toRequestParams(params) {
    return post(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains`,
      this.#getBody(params.target),
    );
  }

  /** @type {CcApiSimpleCommand<CreateLogDrainCommandInput, {id: string}>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return { id: response.id };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }

  /**
   * @param {LogDrainTarget} drain
   */
  #getBody(drain) {
    /** @type {any} */
    const body = {
      url: drain.url,
      drainType: drain.type,
    };

    if (drain.type === 'HTTP' || drain.type === 'ElasticSearch') {
      if (drain.credentials != null) {
        body.credentials = drain.credentials;
      }
    }

    if (drain.type === 'ElasticSearch') {
      if (drain.indexPrefix != null) {
        body.indexPrefix = drain.indexPrefix;
      }
    }

    if (drain.type === 'NewRelicHTTP') {
      body.apiKey = drain.apiKey;
    }

    return body;
  }
}
