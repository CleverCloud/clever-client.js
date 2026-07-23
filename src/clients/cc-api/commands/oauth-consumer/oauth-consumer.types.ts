/**
 * A third party application allowed to act on Clever Cloud on a user's behalf through OAuth, along
 * with the rights the user granted it.
 */
export interface OauthConsumer {
  /** Display name shown on the consent screen. */
  name: string;
  /** Description shown on the consent screen. */
  description: string;
  /** OAuth consumer key, which also identifies the consumer in the API. */
  key: string;
  /** URL of the application's home page. */
  url: string;
  /** URL of the logo shown on the consent screen. */
  picture: string;
  /** URL the OAuth callbacks are sent to. */
  baseUrl: string;
  /** Which rights the consumer holds, keyed by right. */
  rights: Record<OauthConsumerRights, boolean>;
  /** OAuth consumer secret. Only filled when it was explicitly asked for. */
  secret?: string;
}

/**
 * A right an OAuth consumer can hold. `almighty` stands in for every right at once and cannot be
 * granted through the update command.
 */
export type OauthConsumerRights = 'almighty' | AccessRights | ManageRights;

/**
 * The read-only rights: what an OAuth consumer may look at.
 */
export type AccessRights =
  /**
   * Read the organisations the user belongs to.
   * @renamedFrom `access_organisations`
   */
  | 'accessOrganisations'
  /**
   * Read those organisations' invoices.
   * @renamedFrom `access_organisations_bills`
   */
  | 'accessOrganisationsBills'
  /**
   * Read those organisations' credit balance.
   * @renamedFrom `access_organisations_credit_count`
   */
  | 'accessOrganisationsCreditCount'
  /**
   * Read those organisations' consumption statistics.
   * @renamedFrom `access_organisations_consumption_statistics`
   */
  | 'accessOrganisationsConsumptionStatistics'
  /**
   * Read the user's own profile.
   * @renamedFrom `access_personal_information`
   */
  | 'accessPersonalInformation';

/**
 * The write rights: what an OAuth consumer may change.
 */
export type ManageRights =
  /**
   * Create and edit organisations.
   * @renamedFrom `manage_organisations`
   */
  | 'manageOrganisations'
  /**
   * Manage those organisations' add-ons.
   * @renamedFrom `manage_organisations_services`
   */
  | 'manageOrganisationsServices'
  /**
   * Manage those organisations' applications.
   * @renamedFrom `manage_organisations_applications`
   */
  | 'manageOrganisationsApplications'
  /**
   * Manage those organisations' members.
   * @renamedFrom `manage_organisations_members`
   */
  | 'manageOrganisationsMembers'
  /**
   * Edit the user's own profile.
   * @renamedFrom `manage_personal_information`
   */
  | 'managePersonalInformation'
  /**
   * Add and remove the user's SSH keys.
   * @renamedFrom `manage_ssh_keys`
   */
  | 'manageSshKeys';
