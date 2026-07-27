import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetOrganisationSummariesCommandOutput } from './get-organisation-summaries-command.types.js';
import { transformOrganisationSummaries } from './organisation-transform.js';

/**
 * Retrieves the summary of every owner the current user has access to, with the products each one
 * holds.
 *
 * The endpoint answers with the current user and their organisations separately: both are folded
 * into a single list here, the personal organisation first and the other organisations sorted by
 * name. The personal organisation and the company organisations do not carry the same fields, so
 * each entry is a discriminated union on `isPersonal` (see {@link OrganisationSummary}).
 *
 * @endpoint [GET] /v2/summary
 * @group Organisation
 * @version 2
 */
export class GetOrganisationSummariesCommand extends CcApiSimpleCommand<void, GetOrganisationSummariesCommandOutput> {
  toRequestParams() {
    return get('/v2/summary');
  }

  transformCommandOutput(response: unknown): GetOrganisationSummariesCommandOutput {
    return transformOrganisationSummaries(response);
  }
}
