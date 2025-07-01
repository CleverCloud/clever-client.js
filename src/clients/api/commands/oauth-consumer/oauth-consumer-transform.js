/**
 * @import { OauthConsumer, AccessRights, ManageRights, OauthConsumerRights } from './oauth-consumer.types.js'
 */

/**
 * @param {any} payload
 * @returns {OauthConsumer}
 */
export function transformOauthConsumer(payload) {
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

/**
 * @param {any} payload
 * @returns {Record<OauthConsumerRights, boolean>}
 */
export function transformOauthConsumerRights(payload) {
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

/**
 * @param {Record<AccessRights | ManageRights, boolean>} rights
 */
export function transformOauthConsumerRightsForApi(rights) {
  return {
    // eslint-disable-next-line camelcase
    access_organisations: rights.accessOrganisations,
    // eslint-disable-next-line camelcase
    access_organisations_bills: rights.accessOrganisationsBills,
    // eslint-disable-next-line camelcase
    access_organisations_credit_count: rights.accessOrganisationsCreditCount,
    // eslint-disable-next-line camelcase
    access_organisations_consumption_statistics: rights.accessOrganisationsConsumptionStatistics,
    // eslint-disable-next-line camelcase
    access_personal_information: rights.accessPersonalInformation,
    // eslint-disable-next-line camelcase
    manage_organisations: rights.manageOrganisations,
    // eslint-disable-next-line camelcase
    manage_organisations_services: rights.manageOrganisationsServices,
    // eslint-disable-next-line camelcase
    manage_organisations_applications: rights.manageOrganisationsApplications,
    // eslint-disable-next-line camelcase
    manage_organisations_members: rights.manageOrganisationsMembers,
    // eslint-disable-next-line camelcase
    manage_personal_information: rights.managePersonalInformation,
    // eslint-disable-next-line camelcase
    manage_ssh_keys: rights.manageSshKeys,
  };
}
