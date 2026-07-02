import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  UpdateOrganisationAvatarCommandInput,
  UpdateOrganisationAvatarCommandOutput,
} from './update-organisation-avatar-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/avatar
 * @group Organisation
 * @version 2
 */
export class UpdateOrganisationAvatarCommand extends CcApiSimpleCommand<
  UpdateOrganisationAvatarCommandInput,
  UpdateOrganisationAvatarCommandOutput
> {
  toRequestParams(params: UpdateOrganisationAvatarCommandInput): Partial<CcRequestParams> {
    return {
      method: 'PUT',
      url: safeUrl`/v2/organisations/${params.organisationId}/avatar`,
      headers: new HeadersBuilder().acceptJson().contentType(params.mimeType).build(),
      body: params.data,
    };
  }
}
