import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  ListOrganisationNoticeCommandInput,
  ListOrganisationNoticeCommandOutput,
} from './list-organisation-notice-command.types.ts';
import { transformNotice } from './notice-transform.ts';

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
