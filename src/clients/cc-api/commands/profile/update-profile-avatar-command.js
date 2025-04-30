/**
 * @import { UpdateProfileAvatarCommandInput, UpdateProfileAvatarCommandOutput } from './update-profile-avatar-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { put } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateProfileAvatarCommandInput, UpdateProfileAvatarCommandOutput>}
 * @endpoint [PUT] /v2/self/avatar
 * @group Profile
 * @version 2
 */
export class UpdateProfileAvatarCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateProfileAvatarCommandInput, UpdateProfileAvatarCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const url = `/v2/self/avatar`;

    switch (params.type) {
      case 'externalSource':
        return put(url, { source: params.source });
      case 'dataSource': {
        return {
          method: 'PUT',
          url,
          headers: new HeadersBuilder().acceptJson().contentType(params.mimeType).build(),
          body: params.data,
        };
      }
    }
  }
}
