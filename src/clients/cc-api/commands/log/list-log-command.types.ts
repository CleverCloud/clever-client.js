import type { AddonId } from '../../types/cc-api.types.js';

export interface ListLogCommandInput extends AddonId {
  limit?: number;
  order?: 'ASC' | 'DESC';
  since?: Date | string | number;
  until?: Date | string | number;
  filter?: string;
  deploymentId?: string;
}

export type ListLogCommandOutput = Array<OldLog>;

export interface OldLog {
  // renamed from _id
  id: string;
  // renamed from _source.@timestamp
  date: string;
  // renamed from _source.message
  message: string;
  // renamed from _source.type
  type: string;
  // renamed from _source.syslog_severity
  severity: string;
  // renamed from _source.syslog_program
  program: string;
  // renamed from _source.deploymentId
  deploymentId: string;
  // renamed from _source.host
  sourceHost: string;
  // renamed from _source.@source
  sourceIp: string;
  // renamed from _source.zone
  zone: string;
}
