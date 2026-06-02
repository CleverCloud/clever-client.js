import type { AccessRights, ManageRights, OauthConsumer, OauthConsumerRights } from './oauth-consumer.types.js';

export function transformOauthConsumer(payload: any): OauthConsumer {
  return {
    key: payload.key,
    name: payload.name,
    description: payload.description,
    url: payload.url,
    picture: payload.picture,
    baseUrl: payload.baseUrl,
    rights: transformOauthConsumerRights(payload.rights),
  };
}

export function transformOauthConsumerRights(payload: any): Record<OauthConsumerRights, boolean> {
  return {
    almighty: payload.almighty,
    accessOrganisations: payload.access_organisations,
    accessOrganisationsBills: payload.access_organisations_bills,
    accessOrganisationsCreditCount: payload.access_organisations_credit_count,
    accessOrganisationsConsumptionStatistics: payload.access_organisations_consumption_statistics,
    accessPersonalInformation: payload.access_personal_information,
    manageOrganisations: payload.manage_organisations,
    manageOrganisationsServices: payload.manage_organisations_services,
    manageOrganisationsApplications: payload.manage_organisations_applications,
    manageOrganisationsMembers: payload.manage_organisations_members,
    managePersonalInformation: payload.manage_personal_information,
    manageSshKeys: payload.manage_ssh_keys,
  };
}

export function transformOauthConsumerRightsForApi(rights: Record<AccessRights | ManageRights, boolean>) {
  return {
    access_organisations: rights.accessOrganisations,
    access_organisations_bills: rights.accessOrganisationsBills,
    access_organisations_credit_count: rights.accessOrganisationsCreditCount,
    access_organisations_consumption_statistics: rights.accessOrganisationsConsumptionStatistics,
    access_personal_information: rights.accessPersonalInformation,
    manage_organisations: rights.manageOrganisations,
    manage_organisations_services: rights.manageOrganisationsServices,
    manage_organisations_applications: rights.manageOrganisationsApplications,
    manage_organisations_members: rights.manageOrganisationsMembers,
    manage_personal_information: rights.managePersonalInformation,
    manage_ssh_keys: rights.manageSshKeys,
  };
}
