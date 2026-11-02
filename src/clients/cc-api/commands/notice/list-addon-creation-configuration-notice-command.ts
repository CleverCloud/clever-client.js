import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  ListAddonCreationConfigurationNoticeCommandInput,
  ListAddonCreationConfigurationNoticeCommandOutput,
} from './list-addon-creation-configuration-notice-command.types.js';
import { transformNotice } from './notice-transform.js';

/**
 * Lists the notices to show in the add-on creation flow once a provider is chosen, while the user
 * configures the add-on, oldest first, in the user's language.
 *
 * An unknown provider, or one the user cannot see, rejects with a 404.
 *
 * @endpoint [GET] /v4/notices/addon-creation-configuration/:XXX
 * @group Notice
 * @version 4
 */
export class ListAddonCreationConfigurationNoticeCommand extends CcApiSimpleCommand<
  ListAddonCreationConfigurationNoticeCommandInput,
  ListAddonCreationConfigurationNoticeCommandOutput
> {
  toRequestParams(params: ListAddonCreationConfigurationNoticeCommandInput) {
    return get(
      safeUrl`/v4/notices/addon-creation-configuration/${params.addonProviderId}`,
      new QueryParams().set('orgaId', params.ownerId),
    );
  }

  transformCommandOutput(response: unknown): ListAddonCreationConfigurationNoticeCommandOutput {
    return (response as Array<unknown>).map(transformNotice);
  }

  isIdempotent(): boolean {
    return true;
  }
}
