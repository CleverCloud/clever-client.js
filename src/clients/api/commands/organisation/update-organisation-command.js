/**
 * @import { UpdateOrganisationCommandInput, UpdateOrganisationCommandOutput } from './update-organisation-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateOrganisationCommandInput, UpdateOrganisationCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX
 * @group Organisation
 * @version 2
 */
export class UpdateOrganisationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateOrganisationCommandInput, UpdateOrganisationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/organisations/:XXX`, {});
  }
}
