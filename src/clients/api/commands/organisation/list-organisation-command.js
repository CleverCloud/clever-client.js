/**
 * @import { ListOrganisationCommandOutput } from './list-organisation-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, ListOrganisationCommandOutput>}
 * @endpoint [GET] /v2/organisations
 * @group Organisation
 * @version 2
 */
export class ListOrganisationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ListOrganisationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(`/v2/organisations`);
  }

  /** @type {CcApiSimpleCommand<void, ListOrganisationCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
