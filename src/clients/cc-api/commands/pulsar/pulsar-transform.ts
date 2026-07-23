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
    createdAt: normalizeDate(payload.creation_date)!,
    askForDeletionAt: normalizeDate(payload.ask_for_deletion_date)!,
    deletedAt: normalizeDate(payload.deletion_date)!,
    status: payload.status,
    plan: payload.plan,
    coldStorageId: payload.cold_storage_id,
    isColdStorageLinked: payload.cold_storage_linked,
    isColdStorageMustBeProvided: payload.cold_storage_must_be_provided,
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
    isAvailable: payload.available,
    zone: payload.zone.toLowerCase(),
    isColdStorageSupported: payload.support_cold_storage,
    supportedPlans: payload.supported_plans,
  };
}
