import { post } from '../../../../lib/request/request-params-builder.ts';
import { omit } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  CreateOrganisationCommandInput,
  CreateOrganisationCommandOutput,
} from './create-organisation-command.types.ts';
import { transformOrganisation } from './organisation-transform.ts';

/**
 * Creates an organisation owned by the current user.
 *
 * The current user becomes its first `ADMIN` member. Organisation creation can be disabled
 * platform wide, in which case the call is refused.
 *
 * @endpoint [POST] /v2/organisations
 * @group Organisation
 * @version 2
 */
export class CreateOrganisationCommand extends CcApiSimpleCommand<
  CreateOrganisationCommandInput,
  CreateOrganisationCommandOutput
> {
  toRequestParams(params: CreateOrganisationCommandInput) {
    // the wire still spells the VAT number `VAT`
    const vat = 'vat' in params ? { VAT: params.vat } : {};
    const body = {
      ...omit('vat' in params ? omit(params, 'vat') : params, 'billingEmailAddress', 'contacts'),
      ...vat,
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

  // each call creates one more organisation, with its own id, and spends a creation quota token
  isIdempotent(): boolean {
    return false;
  }
}
