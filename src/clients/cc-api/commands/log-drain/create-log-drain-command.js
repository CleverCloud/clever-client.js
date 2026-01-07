/**
 * @import { CreateLogDrainCommandInput, CreateLogDrainCommandOutput } from './create-log-drain-command.types.js';
 * @import { LogDrainTarget } from './log-drain.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { waitForLogDrainEnabled } from './log-drain-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<CreateLogDrainCommandInput, CreateLogDrainCommandOutput>}
 * @endpoint [POST] /v4/drains/organisations/:XXX/applications/:XXX/drains
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX (polling)
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
   * @param {string} kind - The kind of logs to drain ('LOG', 'ACCESSLOG', or 'AUDITLOG')
   */
  #getBody(drain, kind) {
    /** @type {any} */
    const body = {
      kind,
      recipient: {
        type: this.#mapDrainType(drain.type),
        url: drain.url,
      },
    };

    // HTTP and ElasticSearch: credentials
    if (drain.type === 'HTTP' || drain.type === 'ElasticSearch') {
      if (drain.credentials != null) {
        body.recipient.username = drain.credentials.username;
        body.recipient.password = drain.credentials.password;
      }
    }

    // ElasticSearch: index (renamed from indexPrefix)
    if (drain.type === 'ElasticSearch') {
      if (drain.indexPrefix != null) {
        body.recipient.index = drain.indexPrefix;
      }
    }

    // NewRelic: apiKey
    if (drain.type === 'NewRelicHTTP') {
      body.recipient.apiKey = drain.apiKey;
    }

    // Syslog: RFC 5424 structured data parameters
    if (drain.type === 'TCPSyslog' || drain.type === 'UDPSyslog') {
      if (drain.structuredDataParameters != null) {
        body.recipient.rfc5424StructuredDataParameters = drain.structuredDataParameters;
      }
    }

    return body;
  }

  /**
   * Map client drain types to API codes
   * @param {LogDrainTarget['type']} clientType
   * @returns {string}
   */
  #mapDrainType(clientType) {
    const mapping = {
      HTTP: 'RAW_HTTP',
      DatadogHTTP: 'DATADOG',
      NewRelicHTTP: 'NEWRELIC',
      TCPSyslog: 'SYSLOG_TCP',
      UDPSyslog: 'SYSLOG_UDP',
      ElasticSearch: 'ELASTICSEARCH',
    };
    return mapping[clientType] || clientType;
  }
}
