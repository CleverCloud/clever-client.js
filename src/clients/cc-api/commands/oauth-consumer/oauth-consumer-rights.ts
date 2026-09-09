/**
 * The read-only rights: what an OAuth consumer may look at.
 */
export const ACCESS_RIGHTS = [
  /**
   * Read the organisations the user belongs to.
   * @renamedFrom `access_organisations`
   */
  'accessOrganisations',
  /**
   * Read those organisations' invoices.
   * @renamedFrom `access_organisations_bills`
   */
  'accessOrganisationsBills',
  /**
   * Read those organisations' consumption statistics.
   * @renamedFrom `access_organisations_consumption_statistics`
   */
  'accessOrganisationsConsumptionStatistics',
  /**
   * Read those organisations' credit balance.
   * @renamedFrom `access_organisations_credit_count`
   */
  'accessOrganisationsCreditCount',
  /**
   * Read the user's own profile.
   * @renamedFrom `access_personal_information`
   */
  'accessPersonalInformation',
] as const;

/**
 * The write rights: what an OAuth consumer may change.
 */
export const MANAGE_RIGHTS = [
  /**
   * Create and edit organisations.
   * @renamedFrom `manage_organisations`
   */
  'manageOrganisations',
  /**
   * Manage those organisations' applications.
   * @renamedFrom `manage_organisations_applications`
   */
  'manageOrganisationsApplications',
  /**
   * Manage those organisations' members.
   * @renamedFrom `manage_organisations_members`
   */
  'manageOrganisationsMembers',
  /**
   * Manage those organisations' add-ons.
   * @renamedFrom `manage_organisations_services`
   */
  'manageOrganisationsServices',
  /**
   * Edit the user's own profile.
   * @renamedFrom `manage_personal_information`
   */
  'managePersonalInformation',
  /**
   * Add and remove the user's SSH keys.
   * @renamedFrom `manage_ssh_keys`
   */
  'manageSshKeys',
] as const;

/**
 * Every right that can actually be granted to an OAuth consumer, in the order they should be
 * presented to a user. `almighty` is deliberately absent: it is derived by the API and cannot be
 * granted through the create or update commands.
 */
export const GRANTABLE_RIGHTS = [...ACCESS_RIGHTS, ...MANAGE_RIGHTS] as const;

/**
 * Every right an OAuth consumer can hold, including the read-only `almighty` one.
 */
export const OAUTH_CONSUMER_RIGHTS = ['almighty', ...GRANTABLE_RIGHTS] as const;

/**
 * The read-only rights: what an OAuth consumer may look at.
 */
export type AccessRights = (typeof ACCESS_RIGHTS)[number];

/**
 * The write rights: what an OAuth consumer may change.
 */
export type ManageRights = (typeof MANAGE_RIGHTS)[number];

/**
 * A right that can be granted to an OAuth consumer through the create and update commands.
 */
export type GrantableRights = (typeof GRANTABLE_RIGHTS)[number];

/**
 * A right an OAuth consumer can hold. `almighty` stands in for every right at once and cannot be
 * granted through the update command.
 */
export type OauthConsumerRights = (typeof OAUTH_CONSUMER_RIGHTS)[number];
