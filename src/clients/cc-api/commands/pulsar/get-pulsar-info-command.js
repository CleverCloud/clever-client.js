/**
 * @import { GetPulsarInfoCommandInput, GetPulsarInfoCommandOutput, GetPulsarInfoInnerCommandOutput, GetPulsarClusterInnerCommandInput, GetPulsarClusterInnerCommandOutput } from './get-pulsar-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<GetPulsarInfoCommandInput, GetPulsarInfoCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/addons/:XXX
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/clusters/:XXX
 * @group Pulsar
 * @version 4
 */
export class GetPulsarInfoCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<GetPulsarInfoCommandInput, GetPulsarInfoCommandOutput>['compose']} */
  async compose(params, composer) {
    const pulsarInfo = await composer.send(new GetPulsarInfoInnerCommand(params));

    if (pulsarInfo == null) {
      return null;
    }

    const pulsarCluster = await composer.send(new GetPulsarClusterCommand({ clusterId: pulsarInfo.clusterId }));

    return {
      ...omit(pulsarInfo, 'clusterId'),
      cluster: pulsarCluster,
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}

/**
 * @extends {CcApiSimpleCommand<GetPulsarInfoCommandInput, GetPulsarInfoInnerCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/addons/:XXX
 * @group Pulsar
 * @version 4
 */
class GetPulsarInfoInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetPulsarInfoCommandInput, GetPulsarInfoInnerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/addon-pulsar/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetPulsarInfoCommandInput, GetPulsarInfoInnerCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      id: response.id,
      tenant: response.tenant,
      namespace: response.namespace,
      clusterId: response.cluster_id,
      token: response.token,
      creationDate: normalizeDate(response.creation_date),
      askForDeletionDate: normalizeDate(response.ask_for_deletion_date),
      deletionDate: normalizeDate(response.deletion_date),
      status: response.status,
      plan: response.plan,
      coldStorageId: response.cold_storage_id,
      coldStorageLinked: response.cold_storage_linked,
      coldStorageMustBeProvided: response.cold_storage_must_be_provided,
    };
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<GetPulsarClusterInnerCommandInput, GetPulsarClusterInnerCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/clusters/:XXX
 * @group Pulsar
 * @version 4
 */
class GetPulsarClusterCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetPulsarClusterInnerCommandInput, GetPulsarClusterInnerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/addon-pulsar/clusters/${params.clusterId}`);
  }

  /** @type {CcApiSimpleCommand<GetPulsarClusterInnerCommandInput, GetPulsarClusterInnerCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      id: response.id,
      url: response.url,
      pulsarPort: response.pulsar_port,
      pulsarTlsPort: response.pulsar_tls_port,
      webPort: response.web_port,
      webTlsPort: response.web_tls_port,
      version: response.version,
      available: response.available,
      zone: response.zone.toLowerCase(),
      supportColdStorage: response.support_cold_storage,
      supportedPlans: response.supported_plans,
    };
  }
}
