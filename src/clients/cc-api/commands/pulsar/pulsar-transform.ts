import { normalizeDate } from '../../../../lib/utils.js';
import type {
  GetPulsarClusterInnerCommandOutput,
  GetPulsarInfoInnerCommandOutput,
} from './get-pulsar-info-command.types.js';

export function transformPulsarInfo(payload: any): GetPulsarInfoInnerCommandOutput {
  return {
    id: payload.id,
    tenant: payload.tenant,
    namespace: payload.namespace,
    clusterId: payload.cluster_id,
    token: payload.token,
    creationDate: normalizeDate(payload.creation_date)!,
    askForDeletionDate: normalizeDate(payload.ask_for_deletion_date)!,
    deletionDate: normalizeDate(payload.deletion_date)!,
    status: payload.status,
    plan: payload.plan,
    coldStorageId: payload.cold_storage_id,
    coldStorageLinked: payload.cold_storage_linked,
    coldStorageMustBeProvided: payload.cold_storage_must_be_provided,
  };
}

export function transformPulsarCluster(payload: any): GetPulsarClusterInnerCommandOutput {
  return {
    id: payload.id,
    url: payload.url,
    pulsarPort: payload.pulsar_port,
    pulsarTlsPort: payload.pulsar_tls_port,
    webPort: payload.web_port,
    webTlsPort: payload.web_tls_port,
    version: payload.version,
    available: payload.available,
    zone: payload.zone.toLowerCase(),
    supportColdStorage: payload.support_cold_storage,
    supportedPlans: payload.supported_plans,
  };
}
