import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { ListAddonNoticeCommandInput, ListAddonNoticeCommandOutput } from './list-addon-notice-command.types.ts';
import { transformNotice } from './notice-transform.ts';

/**
 * Lists the notices to show on an add-on overview, oldest first, in the user's language.
 *
 * @endpoint [GET] /v4/notices/addons/:XXX
 * @group Notice
 * @version 4
 */
export class ListAddonNoticeCommand extends CcApiSimpleCommand<
  ListAddonNoticeCommandInput,
  ListAddonNoticeCommandOutput
> {
  toRequestParams(params: ListAddonNoticeCommandInput) {
    return get(safeUrl`/v4/notices/addons/${params.addonId}`);
  }

  transformCommandOutput(response: unknown): ListAddonNoticeCommandOutput {
    return (response as Array<unknown>).map(transformNotice);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'ADDON_ID',
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
