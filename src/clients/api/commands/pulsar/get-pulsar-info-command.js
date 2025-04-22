import { get } from '../../../../lib/request/request-params-builder.js';
import { omit } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * @typedef {import('./get-pulsar-info-command.types.js').GetPulsarInfoCommandInput} GetPulsarInfoCommandInput
 * @typedef {import('./get-pulsar-info-command.types.js').GetPulsarClusterInfoCommandInput} GetPulsarClusterInfoCommandInput
 * @typedef {import('./pulsar.types.js').PulsarInfo} PulsarInfo
 * @typedef {import('./pulsar.types.js').PulsarInternalInfo} PulsarInternalInfo
 * @typedef {import('./pulsar.types.js').PulsarClusterInfo} PulsarClusterInfo
 * @typedef {import('../../types/cc-api.types.js').CcApiComposeClient} CcApiComposeClient
 * @typedef {import('../../../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @extends {CcApiCompositeCommand<GetPulsarInfoCommandInput, PulsarInfo>}
 * @command {GetPulsarInfoBaseCommand}
 * @command {GetPulsarClusterInfoCommand}
 * @group Pulsar
 */
export class GetPulsarInfoCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<GetPulsarInfoCommandInput, PulsarInfo>['compose']} */
  async compose(params, client) {
    const info = await client.send(new GetPulsarInfoBaseCommand(params));
    if (info == null) {
      return null;
    }
    const cluster = await client.send(new GetPulsarClusterInfoCommand({ clusterId: info.clusterId }));

    return {
      ...omit(info, 'clusterId'),
      cluster,
    };
  }
}

/**
 * @extends {CcApiSimpleCommand<GetPulsarInfoCommandInput, PulsarInternalInfo>}
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/addons/:XXX
 * @operationId GetPulsarInfo
 * @group Pulsar
 * @version 4
 */
class GetPulsarInfoBaseCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetPulsarInfoCommandInput, PulsarInternalInfo>['toRequestParams']} */
  toRequestParams(params) {
    return get(`/v4/addon-providers/addon-pulsar/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<GetPulsarInfoCommandInput, PulsarInternalInfo>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      id: response.id,
      ownerId: response.owner_id,
      tenant: response.tenant,
      namespace: response.namespace,
      clusterId: response.cluster_id,
      token: response.token,
      creationDate: response.creation_date,
      askForDeletionDate: response.ask_for_deletion_date,
      deletionDate: response.deletion_date,
      status: response.status,
      plan: response.plan,
      coldStorageId: response.cold_storage_id,
      coldStorageLinked: response.cold_storage_linked,
      coldStorageMustBeProvided: response.cold_storage_must_be_provided,
    };
  }

  /** @type {CcApiSimpleCommand<GetPulsarInfoCommandInput, PulsarInternalInfo>['isEmptyResponse']} */
  isEmptyResponse(status, body) {
    return status === 404 || (status === 500 && body.id === 11001);
  }
}

/**
 * @extends {CcApiSimpleCommand<GetPulsarClusterInfoCommandInput, PulsarClusterInfo>}
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/clusters/:XXX
 * @operationId GetPulsarInfo
 * @group Pulsar
 * @version 4
 */
class GetPulsarClusterInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetPulsarClusterInfoCommandInput, PulsarClusterInfo>['toRequestParams']} */
  toRequestParams(params) {
    return get(`/v4/addon-providers/addon-pulsar/clusters/${params.clusterId}`);
  }

  /** @type {CcApiSimpleCommand<GetPulsarClusterInfoCommandInput, PulsarClusterInfo>['transformCommandOutput']} */
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
      zone: response.zone,
      supportColdStorage: response.support_cold_storage,
      supportedPlans: response.supported_plans,
    };
  }
}
