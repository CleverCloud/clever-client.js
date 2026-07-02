import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { CreateLogDrainCommandInput, CreateLogDrainCommandOutput } from './create-log-drain-command.types.js';
import { waitForLogDrainEnabled } from './log-drain-utils.js';
import type { LogDrainKind, LogDrainTarget } from './log-drain.types.js';

/**
 * @endpoint [POST] /v4/drains/organisations/:XXX/applications/:XXX/drains
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class CreateLogDrainCommand extends CcApiCompositeCommand<
  CreateLogDrainCommandInput,
  CreateLogDrainCommandOutput
> {
  async compose(params: CreateLogDrainCommandInput, composer: CcApiComposer): Promise<CreateLogDrainCommandOutput> {
    const created = await composer.send(new CreateLogDrainInnerCommand(params));
    return waitForLogDrainEnabled(composer, params.ownerId!, params.applicationId, created.id);
  }
}

/**
 * @endpoint [POST] /v4/drains/organisations/:XXX/applications/:XXX/drains
 * @group LogDrain
 * @version 4
 */
class CreateLogDrainInnerCommand extends CcApiSimpleCommand<CreateLogDrainCommandInput, { id: string }> {
  toRequestParams(params: CreateLogDrainCommandInput) {
    return post(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains`,
      this.#getBody(params.target, params.kind),
    );
  }

  transformCommandOutput(response: unknown): { id: string } {
    return { id: (response as { id: string }).id };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  #getBody(drain: LogDrainTarget, kind: LogDrainKind) {
    const body: {
      kind: LogDrainKind;
      recipient: {
        type: string;
        url: string;
        username?: string;
        password?: string;
        index?: string;
        apiKey?: string;
        rfc5424StructuredDataParameters?: string;
      };
    } = {
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
