import type { Organisation } from './organisation.types.js';

export type UpdateOrganisationCommandInput = UpdateOrganisationStandard | UpdateOrganisationCompany;

export type UpdateOrganisationCommandOutput = Organisation;

interface UpdateOrganisationBase {
  organisationId: string;
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

export interface UpdateOrganisationStandard extends UpdateOrganisationBase {
  country: string;
}

export interface UpdateOrganisationCompany extends UpdateOrganisationBase {
  company: string;
  VAT: string;
}
