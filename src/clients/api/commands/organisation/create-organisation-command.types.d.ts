import type { Organisation } from './organisation.types.js';

export type CreateOrganisationCommandInput = CreateOrganisationStandard | CreateOrganisationCompany;

export type CreateOrganisationCommandOutput = Organisation;

interface CreateOrganisationBase {
  name: string;
  description: string;
  address: string;
  city: string;
  zipcode: string;
  customerFullName: string;
  // renamed from billingEmail
  billingEmailAddress?: string;
  contacts?: Array<{
    // renamed from contact_type
    contactType: 'security' | 'privacy' | 'abuse';
    // renamed from email_address
    emailAddress: string;
    // renamed from phone_number
    phoneNumber: string;
  }>;
}

export interface CreateOrganisationStandard extends CreateOrganisationBase {
  country: string;
}

export interface CreateOrganisationCompany extends CreateOrganisationBase {
  company: string;
  VAT: string;
}
