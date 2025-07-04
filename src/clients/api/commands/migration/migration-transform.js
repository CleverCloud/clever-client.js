/**
 * @import { Migration, MigrationStep } from './migration.types.js';
 */
import { normalizeDate, omit } from '../../../../lib/utils.js';

/**
 * @param {any} payload
 * @returns {Migration}
 */
export function transformMigration(payload) {
  // @ts-ignore
  return {
    ...omit(payload, 'migrationId'),
    id: payload.migrationId,
    requestDate: normalizeDate(payload.requestDate),
    steps: payload.steps.map(
      /** @param {MigrationStep} step */ (step) => ({
        ...step,
        startDate: normalizeDate(step.startDate),
        endDate: normalizeDate(step.endDate),
      }),
    ),
  };
}
