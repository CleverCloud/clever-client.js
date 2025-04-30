/**
 * @import { ListOrganisationCommandInput, ListOrganisationCommandOutput } from './list-organisation-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOrganisation } from './organisation-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListOrganisationCommandInput, ListOrganisationCommandOutput>}
 * @endpoint [GET] /v2/organisations
 * @group Organisation
 * @version 2
 */
export class ListOrganisationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListOrganisationCommandInput, ListOrganisationCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/organisations`);
  }

  /** @type {CcApiSimpleCommand<ListOrganisationCommandInput, ListOrganisationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(
      response
        .filter(/** @param {any} r */ (r) => this.params.withPersonalOrganisation || r.id.startsWith('orga_'))
        .map(transformOrganisation),
      'name',
      'id',
    );
  }
}
