import type { Organisation } from './organisation.types.js';

/**
 * Describes the organisation to create. A company is identified by its legal name and its VAT
 * number, any other organisation by the country it is based in.
 */
export type CreateOrganisationCommandInput = CreateOrganisationStandard | CreateOrganisationCompany;

/**
 * The organisation that was created.
 */
export type CreateOrganisationCommandOutput = Organisation;

/**
 * The fields every organisation carries, whatever its legal nature.
 */
interface CreateOrganisationBase {
  /** Display name of the organisation, at most 128 characters. */
  name: string;
  /** Free text description of the organisation, at most 256 characters. */
  description: string;
  /** Street address of the organisation. */
  address: string;
  /** City of the organisation address. */
  city: string;
  /** Zip code of the organisation address. */
  zipcode: string;
  /** Full name of the customer the invoices are issued to, required when there is no company name. */
  customerFullName: string;
  /**
   * Address the billing notifications are sent to.
   * @sentAs `billingEmail`
   */
  billingEmailAddress?: string;
  /** People to contact about security, privacy or abuse matters. Defaults to an empty list. */
  contacts?: Array<{
    /**
     * What the contact is to be reached about.
     * @sentAs `contact_type`
     */
    contactType: 'security' | 'privacy' | 'abuse';
    /**
     * Email address of the contact.
     * @sentAs `email_address`
     */
    emailAddress: string;
    /**
     * Phone number of the contact.
     * @sentAs `phone_number`
     */
    phoneNumber: string;
  }>;
}

/**
 * An organisation that is not a company, identified by the country it is based in.
 */
export interface CreateOrganisationStandard extends CreateOrganisationBase {
  /** Two letter country code the organisation is based in. Refused when a VAT number is given. */
  country: string;
}

/**
 * An organisation that is a company, identified by its legal name and its European VAT number.
 */
export interface CreateOrganisationCompany extends CreateOrganisationBase {
  /** Legal name of the company. */
  company: string;
  /**
   * European VAT number of the company, validated against VIES.
   * @sentAs `VAT`
   */
  vat: string;
}
