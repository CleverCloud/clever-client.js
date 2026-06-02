import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformLinkedAddonsEnvironment, transformLinkedApplicationsEnvironment } from './environment-transform.js';
import type {
  GetEnvironmentCommandOutput,
  LinkedAddonEnvironment,
  LinkedApplicationEnvironment,
} from './environment.types.js';
import type {
  GetAddonEnvironmentCommandInput,
  GetApplicationEnvironmentCommandInput,
  GetEnvironmentCommandInput,
  GetLinkedAddonEnvironmentCommandInput,
  GetLinkedApplicationEnvironmentCommandInput,
} from './get-environment-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/env
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/env
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/dependencies/env
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/env
 * @group Environment
 * @version 2
 */
export class GetEnvironmentCommand extends CcApiCompositeCommand<
  GetEnvironmentCommandInput,
  GetEnvironmentCommandOutput
> {
  async compose(params: GetEnvironmentCommandInput, composer: CcApiComposer): Promise<GetEnvironmentCommandOutput> {
    if ('applicationId' in params) {
      const responses = await Promise.all([
        composer.send(new GetApplicationEnvironmentCommand(params)),
        params.includeLinkedApplications ? composer.send(new GetLinkedApplicationEnvironmentCommand(params)) : null,
        params.includeLinkedAddons ? composer.send(new GetLinkedAddonEnvironmentCommand(params)) : null,
      ]);

      const result: GetEnvironmentCommandOutput = {
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

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/env
 * @group Environment
 * @version 2
 */
class GetApplicationEnvironmentCommand extends CcApiSimpleCommand<
  GetApplicationEnvironmentCommandInput,
  Array<EnvironmentVariable>
> {
  toRequestParams(params: GetApplicationEnvironmentCommandInput): Partial<CcRequestParams> {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/env`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}

/**
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/env
 * @group Environment
 * @version 2
 */
class GetAddonEnvironmentCommand extends CcApiSimpleCommand<
  GetAddonEnvironmentCommandInput,
  Array<EnvironmentVariable>
> {
  toRequestParams(params: GetAddonEnvironmentCommandInput): Partial<CcRequestParams> {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/env`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/dependencies/env
 * @group Environment
 * @version 2
 */
class GetLinkedApplicationEnvironmentCommand extends CcApiSimpleCommand<
  GetLinkedApplicationEnvironmentCommandInput,
  Array<LinkedApplicationEnvironment>
> {
  toRequestParams(params: GetLinkedApplicationEnvironmentCommandInput): Partial<CcRequestParams> {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/dependencies/env`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): Array<LinkedApplicationEnvironment> {
    return transformLinkedApplicationsEnvironment(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/addons/env
 * @group Environment
 * @version 2
 */
class GetLinkedAddonEnvironmentCommand extends CcApiSimpleCommand<
  GetLinkedAddonEnvironmentCommandInput,
  Array<LinkedAddonEnvironment>
> {
  toRequestParams(params: GetLinkedAddonEnvironmentCommandInput): Partial<CcRequestParams> {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/addons/env`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): Array<LinkedAddonEnvironment> {
    return transformLinkedAddonsEnvironment(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
