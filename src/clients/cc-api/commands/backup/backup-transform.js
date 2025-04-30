/**
 * @import { Backup } from './backup.types.js';
 */

import { normalizeDate } from '../../../../lib/utils.js';

/**
 * @param {any} payload
 * @returns {Backup}
 */
export function transformBackup(payload) {
  return {
    backupId: payload.backup_id,
    entityId: payload.entity_id,
    status: payload.status,
    creationDate: normalizeDate(payload.creation_date),
    deleteAt: normalizeDate(payload.delete_at),
    filename: payload.filename,
    downloadUrl: payload.download_url,
  };
}
