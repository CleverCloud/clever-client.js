import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetOrganisationCommandInput, GetOrganisationCommandOutput } from './get-organisation-command.types.js';
import { transformOrganisation } from './organisation-transform.js';

/**
 * Retrieves an organisation.
 *
 * @endpoint [GET] /v2/organisations/:XXX
 * @group Organisation
 * @version 2
 */
export class GetOrganisationCommand extends CcApiSimpleCommand<
  GetOrganisationCommandInput,
  GetOrganisationCommandOutput
> {
  toRequestParams(params: GetOrganisationCommandInput) {
    return get(safeUrl`/v2/organisations/${params.organisationId}`);
  }

  transformCommandOutput(response: unknown): GetOrganisationCommandOutput {
    return transformOrganisation(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
