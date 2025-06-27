/**
 * @import { CreateOrganisationCommandInput, CreateOrganisationCommandOutput } from './create-organisation-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { omit } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOrganisation } from './organisation-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateOrganisationCommandInput, CreateOrganisationCommandOutput>}
 * @endpoint [POST] /v2/organisations
 * @group Organisation
 * @version 2
 */
export class CreateOrganisationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateOrganisationCommandInput, CreateOrganisationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const body = {
      ...omit(params, 'billingEmailAddress', 'contacts'),
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
    return post(`/v2/organisations`, body);
  }

  /** @type {CcApiSimpleCommand<CreateOrganisationCommandInput, CreateOrganisationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformOrganisation(response);
  }
}
