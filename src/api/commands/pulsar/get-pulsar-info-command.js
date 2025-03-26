import { get } from '../../../common/lib/request/request-params-builder.js';
import { omit } from '../../../common/lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../common/cc-api-commands.js';

/**
 * @typedef {import('./pulsar.types.js').PulsarInfo} PulsarInfo
 * @typedef {import('./pulsar.types.js').PulsarInternalInfo} PulsarInternalInfo
 * @typedef {import('./pulsar.types.js').PulsarClusterInfo} PulsarClusterInfo
 * @typedef {import('../../cc-api-client.js').CcApiClient} CcApiClient
 */

/**
 * @extends {CcApiCompositeCommand<PulsarInfo>}
 */
export class GetPulsarInfoCommand extends CcApiCompositeCommand {
  /**
   * @param {object} params
   * @param {string} params.addonId
   */
  constructor(params) {
    super();
    this.params = params;
  }

  /**
   * @param {CcApiClient} client
   */
  async compose(client) {
    const info = await client.send(new GetPulsarInfoBaseCommand(this.params));
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
 * @extends {CcApiSimpleCommand<PulsarInternalInfo>}
 */
class GetPulsarInfoBaseCommand extends CcApiSimpleCommand {
  /**
   * @param {object} params
   * @param {string} params.addonId
   */
  constructor(params) {
    super();
    this.params = params;
  }

  toRequestParams() {
    //[GET] /v4/addon-providers/:XXX/addons/:XXX
    return get(`/v4/addon-providers/addon-pulsar/addons/${this.params.addonId}`);
  }

  /**
   * @param {any} response
   * @returns {PulsarInternalInfo}
   */
  transformResponseBody(response) {
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

  /**
   * @param {number} status
   * @param {any} body
   * @returns {boolean}
   */
  isEmptyResponse(status, body) {
    return status === 404 || (status === 500 && body.id === 11001);
  }
}

/**
 * @extends {CcApiSimpleCommand<PulsarClusterInfo>}
 */
class GetPulsarClusterInfoCommand extends CcApiSimpleCommand {
  /**
   * @param {object} params
   * @param {string} params.clusterId
   */
  constructor(params) {
    super();
    this.params = params;
  }

  toRequestParams() {
    return get(`/v4/addon-providers/addon-pulsar/clusters/${this.params.clusterId}`);
  }

  /**
   * @param {any} response
   * @returns {PulsarClusterInfo}
   */
  transformResponseBody(response) {
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
