import type { ApplicationState } from '../application/application.types.js';
import type { MfaKind } from '../auth/auth.types.js';

/**
 * The signed-in user as the summary endpoint describes them: who they are and which partner they
 * signed up through. What they own hangs off their personal organisation, not off this.
 */
export interface UserSummary {
  /** Identifier of the user, of the form `user_<uuid>`. It also identifies their personal organisation. */
  id: string;
  /** Display name of the user. */
  name: string;
  /** URL of the user avatar. */
  avatar: string;
  /**
   * Email address of the user.
   * @renamedFrom `email`
   */
  emailAddress: string;
  /**
   * Language the user picked for the console, as an ISO 639-1 code. Absent when they never picked one.
   * @renamedFrom `lang`
   */
  language?: string;
  /**
   * Whether the user is a Clever Cloud administrator.
   * @renamedFrom `admin`
   */
  isAdmin: boolean;
  /** Identifier of the partner the user signed up through. */
  partnerId: string;
  /** Display name of the partner the user signed up through. */
  partnerName: string;
  /** URL of the console of the partner the user signed up through. */
  partnerConsoleUrl: string;
  /** Self-service features the partner the user signed up through forbids. Empty when nothing is forbidden. */
  contextFlags: Array<ContextFlag>;
}

/**
 * Everything one organisation holds as returned by the summary endpoint: its products and the
 * billing flags the console needs to decide what it may offer.
 *
 * The personal organisation of the signed-in user is one of them, discriminated on `isPersonal`:
 * the endpoint publishes no add-on provider for it, so only a {@link StandardOrganisationSummary}
 * carries `providers`.
 */
export type OrganisationSummary = PersonalOrganisationSummary | StandardOrganisationSummary;

/**
 * The fields every organisation summary holds, whether it is the personal organisation or a regular
 * one.
 */
export interface BaseOrganisationSummary {
  /** Identifier of the organisation, of the form `orga_<uuid>`, or `user_<uuid>` for a personal organisation. */
  id: string;
  /** Display name of the organisation. Always `Personal space` for a personal organisation. */
  name: string;
  /** URL of the organisation avatar. */
  avatar: string;
  /** Applications owned by the organisation. Sorted by name, then id. */
  applications: Array<ApplicationSummary>;
  /** Add-ons owned by the organisation. Sorted by name, then id. */
  addons: Array<AddonSummary>;
  /** OAuth consumers declared by the organisation. Sorted by name, then key. */
  consumers: Array<ConsumerSummary>;
  /** Role the signed-in user has on the organisation. Always `ADMIN` on a personal organisation. */
  role: OrganisationMemberRole;
  /** How far the VAT number of the organisation got through validation. */
  vatState: OrganisationVatState;
  /**
   * Whether the organisation may be charged. The summary derives it from `vatState` alone, so it is `false` only when
   * that state is `INVALID`; the `canPay` of {@link Organisation} answers on the completeness of the billing details
   * instead.
   */
  canPay: boolean;
  /**
   * Whether SEPA direct debit is offered to this organisation, which requires it to be trusted, to have a valid VAT
   * number, or to be on a premium plan.
   * @renamedFrom `canSEPA`
   */
  canPayWithSepa: boolean;
  /**
   * Whether the organisation is on the Clever Cloud premium support plan.
   * @renamedFrom `cleverEnterprise`
   */
  isPremium: boolean;
  /** Phone number the organisation may call for emergency support. */
  emergencyNumber: string;
  /** Whether the organisation was manually flagged as trusted. */
  isTrusted: boolean;
  /** Self-service features the partner this organisation is attached to forbids. Empty when nothing is forbidden. */
  contextFlags: Array<ContextFlag>;
}

/**
 * The summary of the personal organisation of the signed-in user: the owner their own applications
 * and add-ons belong to.
 *
 * The endpoint sends its products on the payload's user rather than on the organisation itself, and
 * never publishes its add-on providers, so they are taken from the user here and there is no
 * `providers` field.
 */
export interface PersonalOrganisationSummary extends BaseOrganisationSummary {
  /** Always `true`: this summary is the personal organisation. Set while transforming; the payload does not carry it. */
  isPersonal: true;
}

/**
 * The summary of a regular organisation the signed-in user belongs to.
 */
export interface StandardOrganisationSummary extends BaseOrganisationSummary {
  /** Always `false`: this summary is a regular organisation, not the personal one. Set while transforming. */
  isPersonal: false;
  /** Add-on providers published by the organisation. Sorted by name, then id. */
  providers: Array<ProviderSummary>;
}

/**
 * An application as it appears in an organisation summary: enough to list it and show its state,
 * without the full application details.
 */
export interface ApplicationSummary {
  /** Identifier of the application, of the form `app_<uuid>`. */
  id: string;
  /** Display name of the application. */
  name: string;
  /** Identifier of the runtime the application runs on, for example `node` or `docker`. */
  instanceType: string;
  /**
   * Display name of the runtime variant the application was created with, for example `Node.js`.
   * @renamedFrom `instanceVariant`
   */
  variantName: string;
  /** Slug of the runtime variant, usable in a URL. */
  variantSlug: string;
  /**
   * Whether the application is archived, that is kept but excluded from listings.
   * @renamedFrom `archived`
   */
  isArchived: boolean;
  /**
   * Whether a new deployment is rolled out alongside the running one before traffic is switched.
   * @renamedFrom `homogeneous`
   * @converted with the boolean inverted
   */
  isZeroDowntimeDeploymentEnabled: boolean;
  /** URL of the logo of the runtime variant. */
  variantLogoUrl: string;
  /** Whether the application is meant to be running, and why it may not be. */
  state: ApplicationState;
  /**
   * Commit currently deployed, or the commit the application is pinned to.
   * @renamedFrom `commit`
   */
  commitId: string;
  /** Tags set by the platform on the application. */
  systemTags: Array<string>;
  /** Tags set by the customer on the application. */
  customerTags: Array<string>;
}

/**
 * An add-on as it appears in an organisation summary: enough to list it and link to its dashboard.
 */
export interface AddonSummary {
  /** Identifier of the add-on, of the form `addon_<uuid>`. */
  id: string;
  /** Display name of the add-on. */
  name: string;
  /** Identifier of the add-on on the provider side, the one the provider's own API uses. */
  realId: string;
  /** Identifier of the provider the add-on was provisioned from, for example `postgresql-addon`. */
  providerId: string;
  /** URL of the logo of the provider. */
  logoUrl: string;
  /** Tags set by the platform on the add-on. */
  systemTags: Array<string>;
  /** Tags set by the customer on the add-on. */
  customerTags: Array<string>;
}

/**
 * An OAuth 1 consumer declared by an organisation, as it appears in a summary.
 */
export interface ConsumerSummary {
  /** Display name of the consumer. */
  name: string;
  /** OAuth consumer key, which also identifies the consumer. */
  key: string;
  /** URL of the consumer picture. */
  picture: string;
}

/**
 * An add-on provider published by an organisation, as it appears in a summary.
 */
export interface ProviderSummary {
  /** Identifier of the provider, for example `postgresql-addon`. */
  id: string;
  /** Display name of the provider. */
  name: string;
}

/**
 * How far a VAT number got through validation: `INVALID` when there is no number or it is
 * malformed, `PENDING_VALIDATION` when VIES accepted it but nobody confirmed it manually,
 * `VALID` when both did, `NOT_NEEDED` when the company was manually exempted, and
 * `NOT_APPLICABLE` when the organisation is not a company.
 */
export type OrganisationVatState = 'INVALID' | 'PENDING_VALIDATION' | 'VALID' | 'NOT_NEEDED' | 'NOT_APPLICABLE';

/**
 * A self-service feature a partner forbids to the users and organisations attached to it:
 * `DENY_ORGA_CREATION` forbids creating an organisation, `DENY_ORGA_UPDATE` editing the information
 * of one, `DENY_ORGA_DELETION` deleting one, `DENY_ORGA_MEMBER_UPDATE` any change to the members of
 * one (addition, role change, removal, invitation), `DENY_ORGA_MEMBER_LIST` listing them, and
 * `DENY_SELF_ACCOUNT_DELETION` deleting the user account itself.
 */
export type ContextFlag =
  | 'DENY_ORGA_CREATION'
  | 'DENY_ORGA_UPDATE'
  | 'DENY_ORGA_DELETION'
  | 'DENY_ORGA_MEMBER_UPDATE'
  | 'DENY_ORGA_MEMBER_LIST'
  | 'DENY_SELF_ACCOUNT_DELETION';

/**
 * An organisation: the owner that applications, add-ons and invoices belong to, carrying the legal
 * and billing identity those invoices are issued to.
 */
export interface Organisation {
  /** Identifier of the organisation, of the form `orga_<uuid>`, or `user_<uuid>` for a personal organisation. */
  id: string;
  /** Display name of the organisation. */
  name: string;
  /** Free text description of the organisation. */
  description: string;
  /**
   * Address the billing notifications are sent to.
   * @renamedFrom `billingEmail`
   */
  billingEmailAddress: string;
  /** Street address of the organisation. */
  address: string;
  /** City of the organisation address. */
  city: string;
  /** Zip code of the organisation address. */
  zipcode: string;
  /** Two letter country code of the organisation address. Only set when the organisation has no VAT number. */
  country: string;
  /** Legal name of the company, when the organisation is one. */
  company: string;
  /**
   * European VAT number of the organisation.
   * @renamedFrom `VAT`
   */
  vat: string;
  /** URL of the organisation avatar. */
  avatar: string;
  /** How far the VAT number got through validation. */
  vatState: OrganisationVatState;
  /** Full name of the customer the invoices are issued to, when the organisation is not a company. */
  customerFullName: string;
  /**
   * Whether the billing details are complete enough to pay: an address, and a company name or a
   * customer full name.
   */
  canPay: boolean;
  /**
   * Whether the organisation is on the Clever Cloud premium support plan.
   * @renamedFrom `cleverEnterprise`
   */
  isPremium: boolean;
  /** Phone number the organisation may call for emergency support. */
  emergencyNumber: string;
  /**
   * Whether SEPA direct debit is offered to this organisation, which requires it to be trusted, to have a valid VAT
   * number, or to be on a premium plan.
   * @renamedFrom `canSEPA`
   */
  canPayWithSepa: boolean;
  /** Whether the organisation was manually flagged as trusted. */
  isTrusted: boolean;
  /** Self-service features the partner this organisation is attached to forbids. Empty when nothing is forbidden. */
  contextFlags: Array<ContextFlag>;
}

/**
 * A user who is part of an organisation, with the role that decides what they may do on it.
 */
export interface OrganisationMember {
  /**
   * Identifier of the user, of the form `user_<uuid>`.
   * @renamedFrom `member.id`
   */
  id: string;
  /**
   * Email address of the user.
   * @renamedFrom `member.email`
   */
  emailAddress: string;
  /**
   * Display name of the user.
   * @renamedFrom `member.name`
   */
  name: string;
  /**
   * URL of the user avatar.
   * @renamedFrom `member.avatar`
   */
  avatar: string;
  /**
   * Second factor the user authenticates with.
   * @renamedFrom `member.preferredMFA`
   */
  preferredMfa: MfaKind;
  /** Role the user has on the organisation. */
  role: OrganisationMemberRole;
  /**
   * Free text job title of the user within the organisation.
   * @renamedFrom `job`
   */
  jobTitle?: string;
}

/**
 * What a member may do on an organisation: `ADMIN` may do everything, including deleting it and
 * assigning any role; `MANAGER` may do everything but delete it; `DEVELOPER` may work on the
 * applications and add-ons but not on the members nor the billing; `ACCOUNTING` may only read the
 * consumptions and the invoices; `NONE` may do nothing.
 */
export type OrganisationMemberRole = 'NONE' | 'ADMIN' | 'ACCOUNTING' | 'DEVELOPER' | 'MANAGER';
