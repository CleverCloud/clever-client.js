import type { AddonId } from '../../types/cc-api.types.js';
import type { Backup } from './backup.types.js';

export type ListBackupCommandInput = AddonId;

export type ListBackupCommandOutput = Array<Backup>;
