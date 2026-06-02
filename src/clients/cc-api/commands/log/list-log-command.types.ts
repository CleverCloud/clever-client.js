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
  id: string;
  date: string;
  message: string;
  type: string;
  severity: string;
  program: string;
  deploymentId: string;
  sourceHost: string;
  sourceIp: string;
  zone: string;
}
