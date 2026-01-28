/**
 * @import { CreateLogDrainCommandInput, CreateLogDrainCommandOutput } from './create-log-drain-command.types.js';
 * @import { LogDrainTarget, LogDrainKind } from './log-drain.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { waitForLogDrainEnabled } from './log-drain-utils.js';

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
    return waitForLogDrainEnabled(composer, params.ownerId, params.applicationId, created.id);
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
      this.#getBody(params.target, params.kind),
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
   * @param {LogDrainKind} kind
   */
  #getBody(drain, kind) {
    /** @type {any} */
    const body = {
      kind,
      recipient: {
        type: drain.type,
        url: drain.url,
      },
    };

    // RAW_HTTP and ELASTICSEARCH: credentials
    if (drain.type === 'RAW_HTTP' || drain.type === 'ELASTICSEARCH') {
      if (drain.credentials != null) {
        body.recipient.username = drain.credentials.username;
        body.recipient.password = drain.credentials.password;
      }
    }

    // ELASTICSEARCH: index (renamed from indexPrefix)
    if (drain.type === 'ELASTICSEARCH') {
      if (drain.indexPrefix != null) {
        body.recipient.index = drain.indexPrefix;
      }
    }

    // NEWRELIC: apiKey
    if (drain.type === 'NEWRELIC') {
      body.recipient.apiKey = drain.apiKey;
    }

    // Syslog: RFC 5424 structured data parameters
    if (drain.type === 'SYSLOG_TCP' || drain.type === 'SYSLOG_UDP') {
      if (drain.structuredDataParameters != null) {
        body.recipient.rfc5424StructuredDataParameters = drain.structuredDataParameters;
      }
    }

    return body;
  }
}
