import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ResetGrafanaCommandInput } from './reset-grafana-command.types.js';

/**
 * Puts the Clever Cloud dashboards back to the state they ship in, discarding local edits.
 *
 * The Grafana organisation and any dashboard the owner created themselves are kept.
 *
 * @endpoint [POST] /v4/saas/grafana/:XXX/reset
 * @group Grafana
 * @version 4
 */
export class ResetGrafanaCommand extends CcApiSimpleCommand<ResetGrafanaCommandInput, undefined> {
  toRequestParams(params: ResetGrafanaCommandInput) {
    return post(safeUrl`/v4/saas/grafana/${params.ownerId}/reset`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // each dashboard is re-applied at its recorded version with `overwrite`, so a replay lands on the same dashboards
  isIdempotent(): boolean {
    return true;
  }
}
