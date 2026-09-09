import { sortBy } from '../../../../lib/utils.js';
import type { GetOrganisationSummaryCommandOutput } from './get-organisation-summary-command.types.js';
import type {
  AddonSummary,
  ApplicationSummary,
  BaseOrganisationSummary,
  ConsumerSummary,
  Organisation,
  OrganisationMember,
  PersonalOrganisationSummary,
  ProviderSummary,
  StandardOrganisationSummary,
  UserSummary,
} from './organisation.types.js';

export function transformOrganisation(payload: any): Organisation {
  return {
    id: payload.id,
    name: payload.name,
    description: payload.description,
    billingEmailAddress: payload.billingEmail,
    address: payload.address,
    city: payload.city,
    zipcode: payload.zipcode,
    country: payload.country,
    company: payload.company,
    vat: payload.VAT,
    avatar: payload.avatar,
    vatState: payload.vatState,
    customerFullName: payload.customerFullName,
    canPay: payload.canPay,
    isPremium: payload.cleverEnterprise,
    emergencyNumber: payload.emergencyNumber,
    canPayWithSepa: payload.canSEPA,
    isTrusted: payload.isTrusted,
    contextFlags: payload.contextFlags ?? [],
  };
}

export function transformOrganisationMember(payload: any): OrganisationMember {
  return {
    id: payload.member.id,
    emailAddress: payload.member.email,
    name: payload.member.name,
    avatar: payload.member.avatar,
    preferredMfa: payload.member.preferredMFA,
    role: payload.role,
    jobTitle: payload.job ?? undefined,
  };
}

export function transformOrganisationSummary(payload: any): GetOrganisationSummaryCommandOutput {
  // The endpoint describes the personal organisation twice: the payload's user is the only place
  // its products are sent, its entry among the organisations the only place its billing flags are.
  // A personal organisation shares the id of its user, which is what tells the two kinds apart.
  const summaries: Array<any> = payload.organisations ?? [];
  const personalSummary = summaries.find((summary) => summary.id === payload.user.id);
  const standardSummaries = summaries.filter((summary) => summary.id !== payload.user.id);

  return {
    user: transformUserSummary(payload.user),
    organisations: [
      ...(personalSummary == null ? [] : [transformPersonalOrganisationSummary(personalSummary, payload.user)]),
      ...sortBy(standardSummaries.map(transformStandardOrganisationSummary), 'name'),
    ],
  };
}

function transformUserSummary(payload: any): UserSummary {
  return {
    id: payload.id,
    name: payload.name,
    avatar: payload.avatar,
    emailAddress: payload.email,
    language: payload.lang ?? undefined,
    isAdmin: payload.admin,
    partnerId: payload.partnerId,
    partnerName: payload.partnerName,
    partnerConsoleUrl: payload.partnerConsoleUrl,
    contextFlags: payload.contextFlags ?? [],
  };
}

function transformApplicationSummary(payload: any): ApplicationSummary {
  return {
    id: payload.id,
    name: payload.name,
    instanceType: payload.instanceType,
    variantName: payload.instanceVariant,
    variantSlug: payload.variantSlug,
    isArchived: payload.archived,
    isZeroDowntimeDeploymentEnabled: !payload.homogeneous,
    variantLogoUrl: payload.variantLogoUrl,
    state: payload.state,
    commitId: payload.commit,
    systemTags: payload.systemTags,
    customerTags: payload.customerTags,
  };
}

function transformAddonSummary(payload: any): AddonSummary {
  return {
    id: payload.id,
    name: payload.name,
    realId: payload.realId,
    providerId: payload.providerId,
    logoUrl: payload.logoUrl,
    systemTags: payload.systemTags,
    customerTags: payload.customerTags,
  };
}

function transformConsumerSummary(payload: any): ConsumerSummary {
  return {
    name: payload.name,
    key: payload.key,
    picture: payload.picture,
  };
}

function transformProviderSummary(payload: any): ProviderSummary {
  return {
    id: payload.id,
    name: payload.name,
  };
}

/**
 * `productsPayload` is where the endpoint sends the products of the organisation: the organisation
 * itself for a regular one, the payload's user for a personal one.
 */
function transformBaseOrganisationSummary(payload: any, productsPayload: any): BaseOrganisationSummary {
  return {
    id: payload.id,
    name: payload.name,
    avatar: payload.avatar,
    applications: sortBy((productsPayload.applications ?? []).map(transformApplicationSummary), 'name', 'id'),
    addons: sortBy((productsPayload.addons ?? []).map(transformAddonSummary), 'name', 'id'),
    consumers: sortBy((productsPayload.consumers ?? []).map(transformConsumerSummary), 'name', 'key'),
    role: payload.role,
    vatState: payload.vatState,
    canPay: payload.canPay,
    canPayWithSepa: payload.canSEPA,
    isPremium: payload.cleverEnterprise,
    emergencyNumber: payload.emergencyNumber,
    isTrusted: payload.isTrusted,
    contextFlags: payload.contextFlags ?? [],
  };
}

function transformPersonalOrganisationSummary(payload: any, userPayload: any): PersonalOrganisationSummary {
  return {
    ...transformBaseOrganisationSummary(payload, userPayload),
    isPersonal: true,
  };
}

function transformStandardOrganisationSummary(payload: any): StandardOrganisationSummary {
  return {
    ...transformBaseOrganisationSummary(payload, payload),
    isPersonal: false,
    providers: sortBy((payload.providers ?? []).map(transformProviderSummary), 'name', 'id'),
  };
}
