/**
 * @import { OauthConsumer, AccessRights, ManageRights } from './oauth-consumer.types.js'
 */

/**
 *
 * @param {any} response
 * @returns {OauthConsumer}
 */
export function transformOauthConsumer(response) {
  return {
    key: response.key,
    name: response.name,
    description: response.description,
    url: response.url,
    picture: response.picture,
    baseUrl: response.baseUrl,
    rights: {
      almighty: response.rights.almighty,
      accessOrganisations: response.rights.access_organisations,
      accessOrganisationsBills: response.rights.access_organisations_bills,
      accessOrganisationsCreditCount: response.rights.access_organisations_credit_count,
      accessOrganisationsConsumptionStatistics: response.rights.access_organisations_consumption_statistics,
      accessPersonalInformation: response.rights.access_personal_information,
      manageOrganisations: response.rights.manage_organisations,
      manageOrganisationsServices: response.rights.manage_organisations_services,
      manageOrganisationsApplications: response.rights.manage_organisations_applications,
      manageOrganisationsMembers: response.rights.manage_organisations_members,
      managePersonalInformation: response.rights.manage_personal_information,
      manageSshKeys: response.rights.manage_ssh_keys,
    },
  };
}

/**
 * @param {Record<AccessRights | ManageRights, boolean>} rights
 */
export function transformRightsForApi(rights) {
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
