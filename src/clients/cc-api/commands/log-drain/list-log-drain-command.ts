import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  ListLogDrainCommandInput,
  ListLogDrainCommandInputOwner,
  ListLogDrainCommandOutput,
} from './list-log-drain-command.types.js';
import { transformAuditLogDrain, transformLogDrain } from './log-drain-transform.js';

/**
 * Lists log drains, most recently updated first.
 *
 * Scoped to one application or add-on when the input names one, and to a whole organisation otherwise. The
 * organisation-wide listing spans every application and add-on, and is also the only one to carry the
 * organisation's audit log drains, which are attached to no resource at all — so it is the only one whose
 * output makes room for an `AuditLogDrain`.
 *
 * @endpoint [GET] /v4/drains/organisations/:XXX/resources/:XXX/drains
 * @endpoint [GET] /v4/drains/organisations/:XXX/drains
 * @group LogDrain
 * @version 4
 */
export class ListLogDrainCommand<
  TInput extends ListLogDrainCommandInput = ListLogDrainCommandInput,
> extends CcApiSimpleCommand<TInput, ListLogDrainCommandOutput<TInput>> {
  toRequestParams(params: TInput) {
    const input: ListLogDrainCommandInput = params;
    const queryParams = new QueryParams()
      .set('status', input.status)
      .set('executionStatus', input.executionStatus)
      .set('executionStatusNotIn', input.executionStatusNotIn);

    if (isOrganisationScoped(input)) {
      return get(safeUrl`/v4/drains/organisations/${input.ownerId}/drains`, queryParams);
    }

    const resourceId = 'applicationId' in input ? input.applicationId : input.addonId;

    return get(safeUrl`/v4/drains/organisations/${input.ownerId}/resources/${resourceId}/drains`, queryParams);
  }

  transformCommandOutput(response: unknown): ListLogDrainCommandOutput<TInput> {
    const drains = sortBy(
      (response as Array<Parameters<typeof transformLogDrain>[0]>).map((item) =>
        item.kind === 'AUDITLOG' ? transformAuditLogDrain(item) : transformLogDrain(item),
      ),
      {
        key: 'updatedAt',
        order: 'desc',
      },
    );

    // only the caller's input resolves the conditional output, so it cannot be checked from in here
    return drains as ListLogDrainCommandOutput<TInput>;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Whether the listing covers a whole organisation, rather than one of its resources.
 */
function isOrganisationScoped(params: ListLogDrainCommandInput): params is ListLogDrainCommandInputOwner {
  return !('applicationId' in params) && !('addonId' in params);
}
