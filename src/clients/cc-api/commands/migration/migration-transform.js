/**
 * @import { Migration, MigrationStep } from './migration.types.js';
 */
import { normalizeDate } from '../../../../lib/utils.js';

/**
 * @param {any} payload
 * @returns {Migration}
 */
export function transformMigration(payload) {
  return {
    id: payload.migrationId,
    requestDate: normalizeDate(payload.requestDate),
    steps: payload.steps.map(
      /** @param {MigrationStep} step */ (step) => ({
        ...step,
        startDate: normalizeDate(step.startDate),
        endDate: normalizeDate(step.endDate),
      }),
    ),
    status: payload.status,
  };
}
