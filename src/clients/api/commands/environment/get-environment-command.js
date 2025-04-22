import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiCompositeWithOwnerCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * @typedef {import('./get-environment-command.types.js').GetEnvironmentCommandInput} GetEnvironmentCommandInput
 * @typedef {import('./get-environment-command.types.js').GetApplicationEnvironmentCommandInput} GetApplicationEnvironmentCommandInput
 * @typedef {import('./get-environment-command.types.js').GetAddonEnvironmentCommandInput} GetAddonEnvironmentCommandInput
 * @typedef {import('./get-environment-command.types.js').GetLinkedApplicationEnvironmentCommandInput} GetLinkedApplicationEnvironmentCommandInput
 * @typedef {import('./get-environment-command.types.js').GetLinkedAddonEnvironmentCommandInput} GetLinkedAddonEnvironmentCommandInput
 * @typedef {import('./environment.types.js').GetEnvironmentCommandOutput} GetEnvironmentCommandOutput
 * @typedef {import('./environment.types.js').EnvironmentVariable} EnvironmentVariable
 * @typedef {import('./environment.types.js').LinkedApplicationEnvironment} LinkedApplicationEnvironment
 * @typedef {import('./environment.types.js').LinkedAddonEnvironment} LinkedAddonEnvironment
 * @typedef {import('../../types/cc-api.types.js').CcApiComposeClient} CcApiComposeClient
 * @typedef {import('../../../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @extends {CcApiCompositeWithOwnerCommand<GetEnvironmentCommandInput, GetEnvironmentCommandOutput>}
 */
export class GetEnvironmentCommand extends CcApiCompositeWithOwnerCommand {
  /**
   * @param {import('../../types/cc-api.types.js').WithOwnerId<GetEnvironmentCommandInput>} params
   * @param {CcApiComposeClient} client
   */
  async compose(params, client) {
    if ('applicationId' in params) {
      const responses = await Promise.all([
        client.send(new GetApplicationEnvironmentCommand(params)),
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
 * @extends {CcApiSimpleCommand<GetApplicationEnvironmentCommandInput, Array<EnvironmentVariable>>}
 */
class GetApplicationEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {GetApplicationEnvironmentCommandInput} params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams(params) {
    //[GET] /v2/organisations/:XXX/applications/:XXX/env
    return get(`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/env`);
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
 * @extends {CcApiSimpleCommand<GetAddonEnvironmentCommandInput, Array<EnvironmentVariable>>}
 */
class GetAddonEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {GetAddonEnvironmentCommandInput} params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams(params) {
    //[GET] /v2/organisations/:XXX/applications/:XXX/env
    return get(`/v2/organisations/${params.ownerId}/addons/${params.addonId}/env`);
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
 * @extends {CcApiSimpleCommand<GetLinkedApplicationEnvironmentCommandInput, Array<LinkedApplicationEnvironment>>}
 */
class GetLinkedApplicationEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {GetLinkedApplicationEnvironmentCommandInput} params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams(params) {
    return get(`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/dependencies/env`);
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
  transformCommandOutput(response) {
    return response.map((element) => ({
      applicationId: element.app_id,
      applicationName: element.app_name,
      environment: element.env,
    }));
  }
}

/**
 * @extends {CcApiSimpleCommand<GetLinkedAddonEnvironmentCommandInput, Array<LinkedAddonEnvironment>>}
 */
class GetLinkedAddonEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {GetLinkedApplicationEnvironmentCommandInput} params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams(params) {
    return get(`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/addons/env`);
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
  transformCommandOutput(response) {
    return response.map((element) => ({
      addonProviderId: element.provider_id,
      addonId: element.addon_id,
      addonName: element.addon_name,
      environment: element.env,
    }));
  }
}
