/**
 * @import { CreateOrganisationCommandInput, CreateOrganisationCommandOutput } from './create-organisation-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateOrganisationCommandInput, CreateOrganisationCommandOutput>}
 * @endpoint [POST] /v2/organisations
 * @group Organisation
 * @version 2
 */
export class CreateOrganisationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateOrganisationCommandInput, CreateOrganisationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/v2/organisations`, {});
  }
}
