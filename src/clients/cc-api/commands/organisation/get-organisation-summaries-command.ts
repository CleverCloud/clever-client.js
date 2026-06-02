import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetOrganisationSummariesCommandOutput } from './get-organisation-summaries-command.types.js';
import { transformOrganisationSummaries } from './organisation-transform.js';

/**
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
