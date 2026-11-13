import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { GetGrafanaCommandInput, GetGrafanaCommandOutput } from './get-grafana-command.types.ts';

/**
 * Retrieves the Grafana organisation backing an owner's metrics dashboards.
 *
 * Answers `404` when Grafana has not been enabled for that owner.
 *
 * @endpoint [GET] /v4/saas/grafana/:XXX
 * @group Grafana
 * @version 4
 */
export class GetGrafanaCommand extends CcApiSimpleCommand<GetGrafanaCommandInput, GetGrafanaCommandOutput> {
  toRequestParams(params: GetGrafanaCommandInput) {
    return get(safeUrl`/v4/saas/grafana/${params.ownerId}`);
  }

  transformCommandOutput(response: unknown): GetGrafanaCommandOutput {
    const payload = response as { id: number };
    return {
      id: payload.id,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
