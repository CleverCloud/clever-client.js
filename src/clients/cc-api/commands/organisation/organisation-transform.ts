import { sortBy } from '../../../../lib/utils.js';
import type { GetOrganisationSummariesCommandOutput } from './get-organisation-summaries-command.types.js';
import type { Organisation, OrganisationMember, OrganisationSummary } from './organisation.types.js';

export function transformOrganisation(payload: any): Organisation {
  return {
    id: payload.id,
    name: payload.name,
    description: payload.description,
    // transform billingEmail to billingEmailAddress
    billingEmailAddress: payload.billingEmail,
    address: payload.address,
    city: payload.city,
    zipcode: payload.zipcode,
    country: payload.country,
    company: payload.company,
    VAT: payload.VAT,
    avatar: payload.avatar,
    vatState: payload.vatState,
    customerFullName: payload.customerFullName,
    canPay: payload.canPay,
    cleverEnterprise: payload.cleverEnterprise,
    emergencyNumber: payload.emergencyNumber,
    canSEPA: payload.canSEPA,
    isTrusted: payload.isTrusted,
  };
}

export function transformOrganisationMember(payload: any): OrganisationMember {
  return {
    id: payload.member.id,
    email: payload.member.email,
    name: payload.member.name,
    avatar: payload.member.avatar,
    preferredMFA: payload.member.preferredMFA,
    role: payload.role,
    job: payload.job,
  };
}

export function transformOrganisationSummaries(payload: any): GetOrganisationSummariesCommandOutput {
  const organisations: Array<OrganisationSummary> =
    payload.organisations
      ?.filter((summary: any) => summary.id !== payload.user.id)
      .map((summary: any) => transformOrganisationSummary(summary, false)) ?? [];

  return [transformOrganisationSummary(payload.user, true), ...sortBy(organisations, 'name')];
}

function transformOrganisationSummary(payload: any, isPersonal: boolean): OrganisationSummary {
  return {
    id: payload.id,
    name: payload.name,
    avatar: payload.avatar,
    applications: sortBy(payload.applications ?? [], 'name', 'id'),
    addons: sortBy(payload.addons ?? [], 'name', 'id'),
    consumers: sortBy(payload.consumers ?? [], 'name', 'key'),
    providers: sortBy(payload.providers ?? [], 'name', 'id'),
    role: payload.role,
    vatState: payload.vatState,
    canPay: payload.canPay,
    canSEPA: payload.canSEPA,
    cleverEnterprise: payload.cleverEnterprise,
    emergencyNumber: payload.emergencyNumber,
    isTrusted: payload.isTrusted,
    isPersonal: isPersonal,
  };
}
