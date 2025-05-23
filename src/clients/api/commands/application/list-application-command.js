/**
 * @import { ListApplicationCommandInput, ListApplicationCommandOutput } from './list-application-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformApplication } from './application-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListApplicationCommandInput, ListApplicationCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/applications
 * @group Application
 * @version 2
 */
export class ListApplicationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListApplicationCommandInput, ListApplicationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications`);
  }

  /** @type {CcApiSimpleCommand<ListApplicationCommandInput, ListApplicationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(transformApplication);
  }
}
