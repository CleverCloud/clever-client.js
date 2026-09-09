import { put } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOrganisation } from './organisation-transform.js';
import type {
  UpdateOrganisationCommandInput,
  UpdateOrganisationCommandOutput,
} from './update-organisation-command.types.js';

/**
 * Updates the display and billing identity of an organisation.
 *
 * The whole identity is sent, so every field has to be provided, not only the ones that change.
 *
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

  // the whole identity is overwritten with the given fields, so a replay writes the same values
  isIdempotent(): boolean {
    return true;
  }
}
