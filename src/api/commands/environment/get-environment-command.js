import { get } from '../../../common/lib/request/request-params-builder.js';
import { CcApiCompositeWithAutoOwnerCommand, CcApiSimpleCommand } from '../../common/cc-api-commands.js';

/**
 * @typedef {import('./environment.types.js').GetEnvironmentCommandInput} GetEnvironmentCommandInput
 * @typedef {import('./environment.types.js').GetEnvironmentCommandOutput} GetEnvironmentCommandOutput
 * @typedef {import('./environment.types.js').EnvironmentVariable} EnvironmentVariable
 * @typedef {import('./environment.types.js').LinkedApplicationEnvironment} LinkedApplicationEnvironment
 * @typedef {import('./environment.types.js').LinkedAddonEnvironment} LinkedAddonEnvironment
 * @typedef {import('../../types/cc-api.types.js').CcApiComposeClient} CcApiComposeClient
 */

/**
 * @extends {CcApiCompositeWithAutoOwnerCommand<GetEnvironmentCommandInput, GetEnvironmentCommandOutput>}
 */
export class GetEnvironmentCommand extends CcApiCompositeWithAutoOwnerCommand {
  /**
   * @param {GetEnvironmentCommandInput} params
   */
  constructor(params) {
    super(params);
  }

  /**
   * @param {CcApiComposeClient} client
   * @param {import('../../types/cc-api.types.js').WithOwnerId<GetEnvironmentCommandInput>} params
   */
  async composeWithOwnerId(client, params) {
    if ('applicationId' in params) {
      const responses = await Promise.all([
        client.send(new GetAppEnvironmentCommand(params)),
        this.params.includeLinkedApplications ? client.send(new GetLinkedApplicationEnvironmentCommand(params)) : null,
        this.params.includeLinkedAddons ? client.send(new GetLinkedAddonEnvironmentCommand(params)) : null,
      ]);

      /** @type {GetEnvironmentCommandOutput} */
      const result = {
        environment: responses[0] ?? [],
      };
      if (this.params.includeLinkedApplications) {
        result.linkedApplicationsEnvironment = responses[1];
      }
      if (this.params.includeLinkedAddons) {
        result.linkedAddonsEnvironment = responses[2];
      }

      return result;
    }

    if ('addonId' in params) {
      const environment = await client.send(new GetAddonEnvironmentCommand(params));
      return { environment };
    }

    throw new Error('Invalid params');
  }
}

/**
 * @extends {CcApiSimpleCommand<Array<EnvironmentVariable>>}
 */
class GetAppEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.applicationId
   */
  constructor(params) {
    super();
    this.params = params;
  }

  toRequestParams() {
    //[GET] /v2/organisations/:XXX/applications/:XXX/env
    return get(`/v2/organisations/${this.params.ownerId}/applications/${this.params.applicationId}/env`);
  }

  /**
   * @param {number} status
   * @param {any} _body
   */
  isEmptyResponse(status, _body) {
    return status === 404;
  }
}

/**
 * @extends {CcApiSimpleCommand<Array<EnvironmentVariable>>}
 */
class GetAddonEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   */
  constructor(params) {
    super();
    this.params = params;
  }

  toRequestParams() {
    //[GET] /v2/organisations/:XXX/applications/:XXX/env
    return get(`/v2/organisations/${this.params.ownerId}/addons/${this.params.addonId}/env`);
  }

  /**
   * @param {number} status
   * @param {any} _body
   */
  isEmptyResponse(status, _body) {
    return status === 404;
  }
}

/**
 * @extends {CcApiSimpleCommand<Array<LinkedApplicationEnvironment>>}
 */
class GetLinkedApplicationEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.applicationId
   */
  constructor(params) {
    super();
    this.params = params;
  }

  toRequestParams() {
    return get(`/v2/organisations/${this.params.ownerId}/applications/${this.params.applicationId}/dependencies/env`);
  }

  /**
   * @param {number} status
   * @param {any} _body
   */
  isEmptyResponse(status, _body) {
    return status === 404;
  }

  /**
   * @param {Array<any>} response
   * @returns {Array<LinkedApplicationEnvironment>}
   */
  transformResponseBody(response) {
    return response.map((element) => ({
      applicationId: element.app_id,
      applicationName: element.app_name,
      environment: element.env,
    }));
  }
}

/**
 * @extends {CcApiSimpleCommand<Array<LinkedAddonEnvironment>>}
 */
class GetLinkedAddonEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.applicationId
   */
  constructor(params) {
    super();
    this.params = params;
  }

  toRequestParams() {
    return get(`/v2/organisations/${this.params.ownerId}/applications/${this.params.applicationId}/addons/env`);
  }

  /**
   * @param {number} status
   * @param {any} _body
   */
  isEmptyResponse(status, _body) {
    return status === 404;
  }

  /**
   * @param {Array<any>} response
   * @returns {Array<LinkedAddonEnvironment>}
   */
  transformResponseBody(response) {
    return response.map((element) => ({
      addonProviderId: element.provider_id,
      addonId: element.addon_id,
      addonName: element.addon_name,
      environment: element.env,
    }));
  }
}
