import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  ListApplicationNoticeCommandInput,
  ListApplicationNoticeCommandOutput,
} from './list-application-notice-command.types.js';
import { transformNotice } from './notice-transform.js';

/**
 * Lists the notices to show on an application overview, oldest first, in the user's language.
 *
 * @endpoint [GET] /v4/notices/applications/:XXX
 * @group Notice
 * @version 4
 */
export class ListApplicationNoticeCommand extends CcApiSimpleCommand<
  ListApplicationNoticeCommandInput,
  ListApplicationNoticeCommandOutput
> {
  toRequestParams(params: ListApplicationNoticeCommandInput) {
    return get(safeUrl`/v4/notices/applications/${params.applicationId}`);
  }

  transformCommandOutput(response: unknown): ListApplicationNoticeCommandOutput {
    return (response as Array<unknown>).map(transformNotice);
  }

  isIdempotent(): boolean {
    return true;
  }
}
