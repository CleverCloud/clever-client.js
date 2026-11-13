import { get } from '../../../../lib/request/request-params-builder.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { GetOrganisationSummaryCommandOutput } from './get-organisation-summary-command.types.ts';
import { transformOrganisationSummary } from './organisation-transform.ts';

/**
 * Retrieves the signed-in user and the summary of every organisation they have access to, with the
 * products each one holds.
 *
 * The personal organisation comes first, the other organisations follow sorted by name. The
 * endpoint splits the personal organisation over the user and the organisations, which are folded
 * back together here; it publishes no add-on provider for it, so each entry is a discriminated
 * union on `isPersonal` (see {@link OrganisationSummary}).
 *
 * @endpoint [GET] /v2/summary
 * @group Organisation
 * @version 2
 */
export class GetOrganisationSummaryCommand extends CcApiSimpleCommand<void, GetOrganisationSummaryCommandOutput> {
  toRequestParams() {
    return get('/v2/summary');
  }

  transformCommandOutput(response: unknown): GetOrganisationSummaryCommandOutput {
    return transformOrganisationSummary(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
