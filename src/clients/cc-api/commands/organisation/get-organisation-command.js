/**
 * @import { GetOrganisationCommandInput, GetOrganisationCommandOutput } from './get-organisation-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOrganisation } from './organisation-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetOrganisationCommandInput, GetOrganisationCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX
 * @group Organisation
 * @version 2
 */
export class GetOrganisationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetOrganisationCommandInput, GetOrganisationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.organisationId}`);
  }

  /** @type {CcApiSimpleCommand<GetOrganisationCommandInput, GetOrganisationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformOrganisation(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
