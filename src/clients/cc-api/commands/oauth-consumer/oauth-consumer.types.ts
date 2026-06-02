export interface OauthConsumer {
  name: string;
  description: string;
  key: string;
  url: string;
  picture: string;
  baseUrl: string;
  rights: Record<OauthConsumerRights, boolean>;
  secret?: string;
}

export type OauthConsumerRights = 'almighty' | AccessRights | ManageRights;

export type AccessRights =
  // renamed from access_organisations
  | 'accessOrganisations'
  // renamed from access_organisations_bills
  | 'accessOrganisationsBills'
  // renamed from access_organisations_credit_count
  | 'accessOrganisationsCreditCount'
  // renamed from access_organisations_consumption_statistics
  | 'accessOrganisationsConsumptionStatistics'
  // renamed from access_personal_information
  | 'accessPersonalInformation';

export type ManageRights =
  // renamed from manage_organisations
  | 'manageOrganisations'
  // renamed from manage_organisations_services
  | 'manageOrganisationsServices'
  // renamed from manage_organisations_applications
  | 'manageOrganisationsApplications'
  // renamed from manage_organisations_members
  | 'manageOrganisationsMembers'
  // renamed from manage_personal_information
  | 'managePersonalInformation'
  // renamed from manage_ssh_keys
  | 'manageSshKeys';
