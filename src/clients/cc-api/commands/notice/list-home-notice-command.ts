import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ListHomeNoticeCommandInput, ListHomeNoticeCommandOutput } from './list-home-notice-command.types.js';
import { transformNotice } from './notice-transform.js';

/**
 * Lists the notices to show on the console home page, oldest first, in the user's language.
 *
 * @endpoint [GET] /v4/notices/home
 * @group Notice
 * @version 4
 */
export class ListHomeNoticeCommand extends CcApiSimpleCommand<ListHomeNoticeCommandInput, ListHomeNoticeCommandOutput> {
  toRequestParams() {
    return get(`/v4/notices/home`);
  }

  transformCommandOutput(response: unknown): ListHomeNoticeCommandOutput {
    return (response as Array<unknown>).map(transformNotice);
  }

  isIdempotent(): boolean {
    return true;
  }
}
