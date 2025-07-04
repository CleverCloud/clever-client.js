/**
 * @import { GetEnvironmentCommandInput, GetApplicationEnvironmentCommandInput, GetAddonEnvironmentCommandInput, GetLinkedApplicationEnvironmentCommandInput, GetLinkedAddonEnvironmentCommandInput } from './get-environment-command.types.js'
 * @import { GetEnvironmentCommandOutput, LinkedApplicationEnvironment, LinkedAddonEnvironment } from './environment.types.js'
 * @import { CcApiComposer } from '../../types/cc-api.types.js'
 * @import { CcRequestParams } from '../../../../types/request.types.js'
 * @import { EnvironmentVariable } from '../../../../utils/environment.types.js'
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * @extends {CcApiCompositeCommand<GetEnvironmentCommandInput, GetEnvironmentCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/env
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/env
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/dependencies/env
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/env
 * @group Environment
 * @version 2
 */
export class GetEnvironmentCommand extends CcApiCompositeCommand {
  /**
   * @param {GetEnvironmentCommandInput} params
   * @param {CcApiComposer} composer
   */
  async compose(params, composer) {
    if ('applicationId' in params) {
      const responses = await Promise.all([
        composer.send(new GetApplicationEnvironmentCommand(params)),
        params.includeLinkedApplications ? composer.send(new GetLinkedApplicationEnvironmentCommand(params)) : null,
        params.includeLinkedAddons ? composer.send(new GetLinkedAddonEnvironmentCommand(params)) : null,
      ]);

      /** @type {GetEnvironmentCommandOutput} */
      const result = {
        environment: sortBy(responses[0] ?? [], 'name'),
      };
      if (params.includeLinkedApplications) {
        result.linkedApplicationsEnvironment = sortBy(responses[1], 'applicationName');
      }
      if (params.includeLinkedAddons) {
        result.linkedAddonsEnvironment = sortBy(responses[2], 'addonName');
      }

      return result;
    }

    if ('addonId' in params) {
      const environment = await composer.send(new GetAddonEnvironmentCommand(params));
      return { environment: sortBy(environment ?? [], 'name') };
    }

    throw new Error('Invalid params');
  }

  /** @type {CcApiCompositeCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}

/**
 * @extends {CcApiSimpleCommand<GetApplicationEnvironmentCommandInput, Array<EnvironmentVariable>>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/env
 * @group Environment
 * @version 2
 */
class GetApplicationEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {GetApplicationEnvironmentCommandInput} params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/env`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}

/**
 * @extends {CcApiSimpleCommand<GetAddonEnvironmentCommandInput, Array<EnvironmentVariable>>}
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/env
 * @group Environment
 * @version 2
 */
class GetAddonEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {GetAddonEnvironmentCommandInput} params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/env`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}

/**
 * @extends {CcApiSimpleCommand<GetLinkedApplicationEnvironmentCommandInput, Array<LinkedApplicationEnvironment>>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/dependencies/env
 * @group Environment
 * @version 2
 */
class GetLinkedApplicationEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {GetLinkedApplicationEnvironmentCommandInput} params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/dependencies/env`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
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

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}

/**
 * @extends {CcApiSimpleCommand<GetLinkedAddonEnvironmentCommandInput, Array<LinkedAddonEnvironment>>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/addons/env
 * @group Environment
 * @version 2
 */
class GetLinkedAddonEnvironmentCommand extends CcApiSimpleCommand {
  /**
   * @param {GetLinkedApplicationEnvironmentCommandInput} params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/addons/env`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
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

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
