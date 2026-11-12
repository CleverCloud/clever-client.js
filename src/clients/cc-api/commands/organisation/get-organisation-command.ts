import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { GetOrganisationCommandInput, GetOrganisationCommandOutput } from './get-organisation-command.types.ts';
import { transformOrganisation } from './organisation-transform.ts';

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
