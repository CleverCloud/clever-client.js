/**
 * @import { UpdateOrganisationAvatarCommandInput, UpdateOrganisationAvatarCommandOutput } from './update-organisation-avatar-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateOrganisationAvatarCommandInput, UpdateOrganisationAvatarCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/avatar
 * @group Organisation
 * @version 2
 */
export class UpdateOrganisationAvatarCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateOrganisationAvatarCommandInput, UpdateOrganisationAvatarCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/organisations/:XXX/avatar`, {});
  }
}
