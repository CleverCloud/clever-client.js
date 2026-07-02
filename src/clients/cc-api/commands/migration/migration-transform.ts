import { normalizeDate, sortBy } from '../../../../lib/utils.js';
import type { ListMigrationPreorderCommandOutput } from './list-migration-preorder-command.types.js';
import type { Migration, MigrationStep } from './migration.types.js';

export function transformMigration(payload: any): Migration {
  return {
    id: payload.migrationId,
    requestDate: normalizeDate(payload.requestDate)!,
    steps: payload.steps.map((step: MigrationStep) => ({
      ...step,
      startDate: normalizeDate(step.startDate),
      endDate: normalizeDate(step.endDate),
    })),
    status: payload.status,
  };
}

export function transformMigrationPreorder(response: any): ListMigrationPreorderCommandOutput {
  return {
    ownerId: response.ownerId,
    target: response.target,
    emissionDate: normalizeDate(response.emissionDate)!,
    name: response.name,
    company: response.company,
    VAT: response.VAT,
    type: response.type,
    lines: sortBy(
      response.lines?.map((line: any) => ({
        type: line.type,
        description: line.description,
        quantity: line.quantity,
        tva: line.tva,
        priceUnitHt: line.price_unit_ht,
        priceTotalHt: line.price_total_ht,
        pack: line.pack,
        dropQuantity: line.dropQuantity,
        coupon: line.coupon,
        discount: 0,
      })) ?? [],
      'priceTotalHt',
    ),
  };
}
