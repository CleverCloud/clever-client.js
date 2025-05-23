/**
 * @import { GetElasticsearchInfoCommandInput, GetElasticsearchInfoCommandOutput } from './get-elasticsearch-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetElasticsearchInfoCommandInput, GetElasticsearchInfoCommandOutput>}
 * @endpoint [GET] /v2/providers/es-addon/:XXX
 * @group Elasticsearch
 * @version 2
 */
export class GetElasticsearchInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetElasticsearchInfoCommandInput, GetElasticsearchInfoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/providers/es-addon/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<GetElasticsearchInfoCommandInput, GetElasticsearchInfoCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<GetElasticsearchInfoCommandInput, GetElasticsearchInfoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      id: response.id,
      ownerId: response.owner_id,
      addonId: response.app_id,
      plan: response.plan,
      zone: response.zone,
      config: {
        host: response.config.host,
        user: response.config.user,
        password: response.config.password,
        apmUser: response.config.apm_user,
        apmPassword: response.config.apm_password,
        apmAuthToken: response.config.apm_auth_token,
        kibanaUser: response.config.kibana_user,
        kibanaPassword: response.config.kibana_password,
      },
      version: response.version,
      backups: {
        kibanaSnapshotsUrl: response.backups.kibana_snapshots_url,
      },
      kibanaApplication: response.kibana_application,
      apmApplication: response.apm_application,
      services: response.services,
      features: response.features,
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'ADDON_ID',
    };
  }
}
