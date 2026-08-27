import { sortBy } from '../../../../lib/utils.js';
import type { GetOrganisationSummariesCommandOutput } from './get-organisation-summaries-command.types.js';
import type {
  ApplicationSummary,
  BaseOrganisationSummary,
  Organisation,
  OrganisationMember,
  OrganisationSummary,
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
    canPayWithSEPA: payload.canSEPA,
    isTrusted: payload.isTrusted,
  };
}

export function transformOrganisationMember(payload: any): OrganisationMember {
  return {
    id: payload.member.id,
    emailAddress: payload.member.email,
    name: payload.member.name,
    avatar: payload.member.avatar,
    preferredMFA: payload.member.preferredMFA,
    role: payload.role,
    jobTitle: payload.job ?? undefined,
  };
}

export function transformOrganisationSummaries(payload: any): GetOrganisationSummariesCommandOutput {
  const organisations: Array<OrganisationSummary> =
    payload.organisations
      ?.filter((summary: any) => summary.id !== payload.user.id)
      .map((summary: any) => transformOrganisationSummary(summary, false)) ?? [];

  return [transformOrganisationSummary(payload.user, true), ...sortBy(organisations, 'name')];
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
    commit: payload.commit,
    systemTags: payload.systemTags,
    customerTags: payload.customerTags,
  };
}

function transformOrganisationSummary(payload: any, isPersonal: boolean): OrganisationSummary {
  const base: BaseOrganisationSummary = {
    id: payload.id,
    name: payload.name,
    avatar: payload.avatar,
    applications: sortBy((payload.applications ?? []).map(transformApplicationSummary), 'name', 'id'),
    addons: sortBy(payload.addons ?? [], 'name', 'id'),
    consumers: sortBy(payload.consumers ?? [], 'name', 'key'),
    canPayWithSEPA: payload.canSEPA,
  };

  if (isPersonal) {
    // The payload's user (a `UserSummary`) carries the user-specific fields and none of the
    // company billing fields.
    return {
      ...base,
      isPersonal: true,
      emailAddress: payload.email,
      language: payload.lang,
      isAdmin: payload.admin,
      partnerId: payload.partnerId,
      partnerName: payload.partnerName,
      partnerConsoleUrl: payload.partnerConsoleUrl,
    };
  }

  // A company organisation (an `OrganisationSummary`) carries the role and billing fields and none
  // of the user-specific fields.
  return {
    ...base,
    isPersonal: false,
    providers: sortBy(payload.providers ?? [], 'name', 'id'),
    role: payload.role,
    vatState: payload.vatState,
    canPay: payload.canPay,
    isPremium: payload.cleverEnterprise,
    emergencyNumber: payload.emergencyNumber,
    isTrusted: payload.isTrusted,
  };
}
