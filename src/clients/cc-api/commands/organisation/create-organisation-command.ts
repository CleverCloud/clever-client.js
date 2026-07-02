import { post } from '../../../../lib/request/request-params-builder.js';
import { omit } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  CreateOrganisationCommandInput,
  CreateOrganisationCommandOutput,
} from './create-organisation-command.types.js';
import { transformOrganisation } from './organisation-transform.js';

/**
 * @endpoint [POST] /v2/organisations
 * @group Organisation
 * @version 2
 */
export class CreateOrganisationCommand extends CcApiSimpleCommand<
  CreateOrganisationCommandInput,
  CreateOrganisationCommandOutput
> {
  toRequestParams(params: CreateOrganisationCommandInput) {
    const body = {
      ...omit(params, 'billingEmailAddress', 'contacts'),
      billingEmail: params.billingEmailAddress,
      contacts:
        params.contacts?.map((c) => ({
          contact_type: c.contactType,
          email_address: c.emailAddress,
          phone_number: c.phoneNumber,
        })) ?? [],
    };
    return post(`/v2/organisations`, body);
  }

  transformCommandOutput(response: unknown): CreateOrganisationCommandOutput {
    return transformOrganisation(response);
  }
}
