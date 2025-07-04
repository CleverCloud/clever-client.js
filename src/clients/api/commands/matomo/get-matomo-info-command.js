/**
 * @import { GetMatomoInfoCommandInput, GetMatomoInfoCommandOutput } from './get-matomo-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetMatomoInfoCommandInput, GetMatomoInfoCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/:XXX/addons/:XXX
 * @group Matomo
 * @version 4
 */
export class GetMatomoInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetMatomoInfoCommandInput, GetMatomoInfoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/addon-matomo/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<GetMatomoInfoCommandInput, GetMatomoInfoCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<GetMatomoInfoCommandInput, GetMatomoInfoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      id: response.resourceId,
      addonId: response.addonId,
      name: response.name,
      ownerId: response.ownerId,
      plan: response.plan,
      version: response.version,
      phpVersion: response.phpVersion,
      accessUrl: response.accessUrl,
      availableVersions: response.availableVersions,
      resources: response.resources,
      environment: toArray(response.envVars),
    };
  }
}
