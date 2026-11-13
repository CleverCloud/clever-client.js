import { QueryParams } from '../../../../lib/request/query-params.ts';
import { get } from '../../../../lib/request/request-params-builder.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  ListAddonCreationListNoticeCommandInput,
  ListAddonCreationListNoticeCommandOutput,
} from './list-addon-creation-list-notice-command.types.ts';
import { transformProviderNotice } from './notice-transform.ts';

/**
 * Lists the notices to show on the add-on provider list of the creation flow, oldest first, in the
 * user's language.
 *
 * A notice without `addonProviderId` is about the whole list. One with it is about that provider, and
 * comes once per provider it applies to.
 *
 * @endpoint [GET] /v4/notices/addon-creation-list
 * @group Notice
 * @version 4
 */
export class ListAddonCreationListNoticeCommand extends CcApiSimpleCommand<
  ListAddonCreationListNoticeCommandInput,
  ListAddonCreationListNoticeCommandOutput
> {
  toRequestParams(params: ListAddonCreationListNoticeCommandInput) {
    return get(`/v4/notices/addon-creation-list`, new QueryParams().set('orgaId', params.ownerId));
  }

  transformCommandOutput(response: unknown): ListAddonCreationListNoticeCommandOutput {
    return (response as Array<unknown>).map(transformProviderNotice);
  }

  isIdempotent(): boolean {
    return true;
  }
}
