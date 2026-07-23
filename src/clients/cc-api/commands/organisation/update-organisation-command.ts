import { put } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOrganisation } from './organisation-transform.js';
import type {
  UpdateOrganisationCommandInput,
  UpdateOrganisationCommandOutput,
} from './update-organisation-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX
 * @group Organisation
 * @version 2
 */
export class UpdateOrganisationCommand extends CcApiSimpleCommand<
  UpdateOrganisationCommandInput,
  UpdateOrganisationCommandOutput
> {
  toRequestParams(params: UpdateOrganisationCommandInput) {
    // the wire still spells the VAT number `VAT`
    const vat = 'vat' in params ? { VAT: params.vat } : {};
    const body = {
      ...omit('vat' in params ? omit(params, 'vat') : params, 'organisationId', 'billingEmailAddress', 'contacts'),
      ...vat,
      billingEmail: params.billingEmailAddress,
      contacts:
        params.contacts?.map((c) => ({
          contact_type: c.contactType,
          email_address: c.emailAddress,
          phone_number: c.phoneNumber,
        })) ?? [],
    };

    return put(safeUrl`/v2/organisations/${params.organisationId}`, body);
  }

  transformCommandOutput(response: unknown): UpdateOrganisationCommandOutput {
    return transformOrganisation(response);
  }
}
