import { normalizeDate } from '../../../../lib/utils.js';
import type { GetAddonDetailsInnerCommandOutput, InnerBackup } from './list-backup-command.types.js';

export function transformBackup(payload: any): InnerBackup {
  return {
    backupId: payload.backup_id,
    entityId: payload.entity_id,
    status: payload.status,
    createdAt: normalizeDate(payload.creation_date)!,
    expiresAt: normalizeDate(payload.delete_at)!,
    downloadUrl: payload.download_url ?? payload.link,
    restoreCommand: payload.restore_command,
    deleteCommand: payload.delete_command,
  };
}

export function transformAddonDetails(payload: any, providerId: string): GetAddonDetailsInnerCommandOutput {
  return {
    id: payload.id,
    providerId,
    host: payload.host,
    port: payload.port,
    user: payload.user,
    password: payload.password,
    database: payload.database,
  };
}
