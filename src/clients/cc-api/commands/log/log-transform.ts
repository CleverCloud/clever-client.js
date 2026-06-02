import { normalizeDate } from '../../../../lib/utils.js';
import type { ListLogCommandOutput, OldLog } from './list-log-command.types.js';
import type {
  AddonRuntimeLog,
  ApplicationAccessLog,
  ApplicationAccessLogBase,
  ApplicationAccessLogHttpDetail,
  ApplicationRuntimeLog,
} from './log.types.js';

export function transformOldLogs(response: any): ListLogCommandOutput {
  return response.map(
    (rawLog: any): OldLog => ({
      id: rawLog._id,
      date: rawLog._source['@timestamp'],
      message: rawLog._source.message,
      type: rawLog._source.type,
      severity: rawLog._source.syslog_severity,
      program: rawLog._source.syslog_program,
      deploymentId: rawLog._source.deploymentId,
      sourceHost: rawLog._source.host,
      sourceIp: rawLog._source['@source'],
      zone: rawLog._source.zone,
    }),
  );
}

export function transformAddonRuntimeLog(rawLog: any): AddonRuntimeLog {
  return {
    id: rawLog.id,
    addonId: rawLog.resourceId,
    hostname: rawLog.hostname,
    instanceId: rawLog.instanceId,
    date: normalizeDate(rawLog.date),
    zone: rawLog.zone,
    pid: rawLog.pid,
    facility: rawLog.facility,
    severity: rawLog.severity,
    service: rawLog.service,
    message: rawLog.message,
  };
}

export function transformApplicationRuntimeLog(rawLog: any): ApplicationRuntimeLog {
  return {
    id: rawLog.id,
    applicationId: rawLog.applicationId,
    commitId: rawLog.commitId,
    deploymentId: rawLog.deploymentId,
    instanceId: rawLog.instanceId,
    date: normalizeDate(rawLog.date),
    zone: rawLog.zone,
    pid: rawLog.pid,
    facility: rawLog.facility,
    severity: rawLog.severity,
    priority: rawLog.priority,
    version: rawLog.version,
    service: rawLog.service,
    message: rawLog.message,
  };
}

export function transformApplicationAccessLog(payload: any): ApplicationAccessLog | null {
  if (payload.http != null) {
    return {
      ...convertBaseAccessLog(payload),
      type: 'http',
      detail: convertHttpDetail(payload.http),
    };
  }
  // todo: handle TCP and SSH access logs.
  return null;
}

function convertBaseAccessLog(payload: any): Omit<ApplicationAccessLogBase<unknown>, 'detail'> {
  return {
    id: payload.id,
    date: normalizeDate(payload.date),
    applicationId: payload.applicationId,
    instanceId: payload.instanceId,
    requestId: payload.requestId,
    bytesIn: payload.bytesIn,
    bytesOut: payload.bytesOut,
    source: payload.source,
    destination: payload.destination,
    tls: payload.tls,
    zone: payload.zone,
  };
}

function convertHttpDetail(payload: any): ApplicationAccessLogHttpDetail {
  return {
    request: payload.request,
    response: {
      statusCode: payload.response.statusCode,
      time: payload.response.time,
    },
  };
}
