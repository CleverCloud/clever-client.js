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
}

/**
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
}
