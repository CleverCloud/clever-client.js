/**
 * @import { UpdateOrganisationCommandInput, UpdateOrganisationCommandOutput } from './update-organisation-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOrganisation } from './organisation-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateOrganisationCommandInput, UpdateOrganisationCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX
 * @group Organisation
 * @version 2
 */
export class UpdateOrganisationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateOrganisationCommandInput, UpdateOrganisationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const body = {
      ...omit(params, 'organisationId', 'billingEmailAddress', 'contacts'),
      billingEmail: params.billingEmailAddress,
      contacts:
        params.contacts?.map((c) => ({
          // eslint-disable-next-line camelcase
          contact_type: c.contactType,
          // eslint-disable-next-line camelcase
          email_address: c.emailAddress,
          // eslint-disable-next-line camelcase
          phone_number: c.phoneNumber,
        })) ?? [],
    };

    return put(safeUrl`/v2/organisations/${params.organisationId}`, body);
  }

  /** @type {CcApiSimpleCommand<UpdateOrganisationCommandInput, UpdateOrganisationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformOrganisation(response);
  }
}
