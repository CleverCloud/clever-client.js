/**
 * @import { UpdateOrganisationAvatarCommandInput, UpdateOrganisationAvatarCommandOutput } from './update-organisation-avatar-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
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
  async toRequestParams(params) {
    return {
      method: 'PUT',
      url: safeUrl`/v2/organisations/${params.organisationId}/avatar`,
      headers: new HeadersBuilder().acceptJson().contentType(params.mimeType).build(),
      body: params.data,
    };
  }
}
