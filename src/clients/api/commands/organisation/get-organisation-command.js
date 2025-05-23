/**
 * @import { GetOrganisationCommandInput, GetOrganisationCommandOutput } from './get-organisation-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

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
    return get(safeUrl`/v2/organisations/:XXX`);
  }

  /** @type {CcApiSimpleCommand<GetOrganisationCommandInput, GetOrganisationCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
