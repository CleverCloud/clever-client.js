import { QueryParams } from '../../../../lib/request/query-params.js';
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { CreateLogDrainCommandInput, CreateLogDrainCommandOutput } from './create-log-drain-command.types.js';
import { buildLogDrainCreatePayload } from './log-drain-transform.js';
import { waitForLogDrainEnabled } from './log-drain-utils.js';

/**
 * Creates a log drain on an application or an add-on, and waits until it starts shipping.
 *
 * Creation is asynchronous: the drain is persisted first, then enabled in the background. This command polls
 * the drain once a second for up to 30 seconds and only resolves once it reports `ENABLED`, throwing if it has
 * not got there in time. Unless `skipCheck` is set, the API also probes the target before persisting the drain
 * and refuses to create it when the target cannot be reached.
 *
 * @endpoint [POST] /v4/drains/organisations/:XXX/resources/:XXX/drains
 * @endpoint [GET] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX
 * @group LogDrain
 * @version 4
 */
export class CreateLogDrainCommand extends CcApiCompositeCommand<
  CreateLogDrainCommandInput,
  CreateLogDrainCommandOutput
> {
  async compose(params: CreateLogDrainCommandInput, composer: CcApiComposer): Promise<CreateLogDrainCommandOutput> {
    const created = await composer.send(new CreateLogDrainInnerCommand(params));
    return waitForLogDrainEnabled(composer, params, created.id);
  }

  // creation is not guarded by any uniqueness check, so a replay adds a second drain to the resource
  isIdempotent(): boolean {
    return false;
  }
}

/**
 * Creates the log drain and returns its identifier, without waiting for it to start shipping.
 *
 * @endpoint [POST] /v4/drains/organisations/:XXX/resources/:XXX/drains
 * @group LogDrain
 * @version 4
 */
class CreateLogDrainInnerCommand extends CcApiSimpleCommand<CreateLogDrainCommandInput, { id: string }> {
  toRequestParams(params: CreateLogDrainCommandInput) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return post(
      safeUrl`/v4/drains/organisations/${params.ownerId}/resources/${resourceId}/drains`,
      buildLogDrainCreatePayload(params.kind, params.target),
      new QueryParams().set('skipCheck', params.skipCheck),
    );
  }

  transformCommandOutput(response: unknown): { id: string } {
    return { id: (response as { id: string }).id };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  // the handler generates a fresh drain id, so a replay adds a second drain to the resource
  isIdempotent(): boolean {
    return false;
  }
}
