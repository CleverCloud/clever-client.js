import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  ListOrganisationNoticeCommandInput,
  ListOrganisationNoticeCommandOutput,
} from './list-organisation-notice-command.types.js';
import { transformNotice } from './notice-transform.js';

/**
 * Lists the notices to show on an organisation overview, oldest first, in the user's language.
 *
 * @endpoint [GET] /v4/notices/organisations/:XXX
 * @group Notice
 * @version 4
 */
export class ListOrganisationNoticeCommand extends CcApiSimpleCommand<
  ListOrganisationNoticeCommandInput,
  ListOrganisationNoticeCommandOutput
> {
  toRequestParams(params: ListOrganisationNoticeCommandInput) {
    return get(safeUrl`/v4/notices/organisations/${params.ownerId}`);
  }

  transformCommandOutput(response: unknown): ListOrganisationNoticeCommandOutput {
    return (response as Array<unknown>).map(transformNotice);
  }

  isIdempotent(): boolean {
    return true;
  }
}
