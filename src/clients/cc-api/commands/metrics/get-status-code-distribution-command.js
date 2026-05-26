/**
 * @import { GetStatusCodeDistributionCommandInput, GetStatusCodeDistributionCommandOutput } from './get-status-code-distribution-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/** Lowest valid HTTP status code. Codes below this are non-standard. */
const MIN_STANDARD_STATUS_CODE = 100;

/**
 * Gets the distribution of HTTP status codes over time for an owner, optionally restricted to a single application.
 *
 * @extends {CcApiSimpleCommand<GetStatusCodeDistributionCommandInput, GetStatusCodeDistributionCommandOutput>}
 * @endpoint [GET] /v4/stats/organisations/:XXX/http-status-codes
 * @group Metrics
 * @version 4
 */
export class GetStatusCodeDistributionCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetStatusCodeDistributionCommandInput, GetStatusCodeDistributionCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/stats/organisations/${params.ownerId}/http-status-codes`,
      new QueryParams()
        .set('applicationId', params.applicationId)
        .set('from', normalizeDate(params.from))
        .set('to', normalizeDate(params.to)),
    );
  }

  /** @type {CcApiSimpleCommand<GetStatusCodeDistributionCommandInput, GetStatusCodeDistributionCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    const excludeNonStandard = this.params.excludeNonStandardStatusCodes === true;

    /**
     * @param {Array<{code: number, count: number}>} [statuses]
     * @returns {Array<{code: number, count: number}>}
     */
    const keep = (statuses) =>
      (statuses ?? []).filter(({ code }) => !excludeNonStandard || code >= MIN_STANDARD_STATUS_CODE);

    const byDate = response.map(
      /** @param {{date: string, statuses?: Array<{code: number, count: number}>}} entry */ ({ date, statuses }) => {
        const kept = keep(statuses);
        return {
          date: normalizeDate(date),
          total: kept.reduce((sum, { count }) => sum + count, 0),
          statuses: Object.fromEntries(kept.map(({ code, count }) => [code, count])),
        };
      },
    );

    /** @type {Record<number, number>} */
    const statuses = {};
    response.forEach(
      /** @param {{statuses?: Array<{code: number, count: number}>}} entry */ ({ statuses: entryStatuses }) => {
        keep(entryStatuses).forEach(({ code, count }) => {
          statuses[code] = (statuses[code] ?? 0) + count;
        });
      },
    );

    return {
      byDate,
      byStatusCode: {
        total: Object.values(statuses).reduce((sum, count) => sum + count, 0),
        statuses,
      },
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
