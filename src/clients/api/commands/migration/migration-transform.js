/**
 * @import { Migration, MigrationStep } from './migration.types.js';
 */
import { normalizeDate, omit } from '../../../../lib/utils.js';

/**
 * @param {any} response
 * @returns {Migration}
 */
export function transformMigration(response) {
  // @ts-ignore
  return {
    ...omit(response, 'migrationId'),
    id: response.migrationId,
    requestDate: normalizeDate(response.requestDate),
    steps: response.steps.map(
      /** @param {MigrationStep} step */ (step) => ({
        ...step,
        startDate: normalizeDate(step.startDate),
        endDate: normalizeDate(step.endDate),
      }),
    ),
  };
}
